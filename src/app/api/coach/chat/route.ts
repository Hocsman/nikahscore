import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Coach AI non configuré' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { conversationId, message, messages: previousMessages } = await request.json()

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'Conversation ID et message requis' },
        { status: 400 }
      )
    }

    // Vérifier que la conversation appartient à l'utilisateur
    const { data: conversation, error: convError } = await supabase
      .from('coach_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      )
    }

    // Récupérer le contexte utilisateur (questionnaires, résultats)
    const { data: userQuestionnaires } = await supabase
      .from('questionnaires')
      .select(`
        id,
        completed_at,
        compatibility_score,
        questionnaire_responses (
          question_id,
          response_value
        )
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(3)

    // Construire le contexte utilisateur
    let userContext = ''
    if (userQuestionnaires && userQuestionnaires.length > 0) {
      const latestScore = userQuestionnaires[0]?.compatibility_score
      userContext = `
L'utilisateur a complété ${userQuestionnaires.length} questionnaire(s) de compatibilité matrimoniale.
${latestScore ? `Score de compatibilité le plus récent : ${latestScore}%` : ''}
Nombre total de questionnaires : ${userQuestionnaires.length}
      `.trim()
    }

    // Prompt système pour le Coach AI
    const systemPrompt = `Tu es un Coach AI Matrimonial spécialisé dans le mariage islamique et les relations de couple selon les valeurs musulmanes.

**Ton rôle :**
- Conseiller sur le mariage islamique (nikah), les relations de couple, la compatibilité
- Analyser les résultats de questionnaires de compatibilité
- Donner des conseils basés sur le Coran et la Sunnah
- Être bienveillant, empathique et respectueux
- Encourager la communication, la compréhension mutuelle et le respect

**Contexte utilisateur :**
${userContext || 'Aucun questionnaire complété pour le moment.'}

**Principes importants :**
1. Reste toujours dans le cadre islamique (halal)
2. Encourage le dialogue et la compréhension
3. Respecte la confidentialité et la dignité
4. Donne des conseils pratiques et applicables
5. Cite des sources islamiques quand c'est pertinent (Coran, Hadith)
6. Évite les jugements, reste neutre et bienveillant

**Format de réponse :**
- Réponds de manière claire et structurée
- Utilise des emojis avec parcimonie (💡 💬 🤝 💕 📖)
- Donne des exemples concrets quand possible
- Propose des actions/réflexions

**Ton de voix :**
Chaleureux, professionnel, rassurant, sage, encourageant.`

    // Construire l'historique des messages
    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...previousMessages.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    // Appel à OpenAI GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Ou 'gpt-4' si tu as accès
      messages: chatMessages,
      temperature: 0.8,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    })

    const assistantMessage = completion.choices[0].message.content

    if (!assistantMessage) {
      throw new Error('Aucune réponse de l\'IA')
    }

    // Sauvegarder le message de l'utilisateur
    await supabase.from('coach_messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message,
    })

    // Sauvegarder la réponse de l'assistant
    await supabase.from('coach_messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: assistantMessage,
      tokens_used: completion.usage?.total_tokens || 0,
    })

    // Mettre à jour la date de la conversation
    await supabase
      .from('coach_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    // Logger l'utilisation pour analytics
    await supabase.from('analytics_events').insert({
      event_type: 'ai_coach_message_sent',
      user_id: user.id,
      metadata: {
        conversation_id: conversationId,
        tokens_used: completion.usage?.total_tokens || 0,
        model: 'gpt-4o-mini',
      },
    })

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      tokensUsed: completion.usage?.total_tokens || 0,
    })

  } catch (error: any) {
    console.error('Error in coach chat:', error)
    
    // Gérer les erreurs OpenAI spécifiques
    if (error?.error?.type === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Quota OpenAI dépassé. Veuillez réessayer plus tard.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la communication avec le coach' },
      { status: 500 }
    )
  }
}
