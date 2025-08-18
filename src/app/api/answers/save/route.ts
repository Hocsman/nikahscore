import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Utiliser le service role pour contourner RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('💾 Réception données answers/save:', Object.keys(body));

    const { pairId, respondent, answers } = body;

    // Validation des données
    if (!pairId || !respondent || !answers) {
      return NextResponse.json({ 
        error: 'Données manquantes: pairId, respondent et answers requis' 
      }, { status: 400 });
    }

    // Convertir A/B vers initiator/partner pour compatibilité
    const realRespondent = respondent === 'A' ? 'initiator' : 'partner';
    console.log(`📝 Sauvegarde pour ${realRespondent} du couple ${pairId.substring(0, 8)}...`);

    // Vérifier si la table couples existe, sinon la créer
    try {
      // Vérifier/créer le couple s'il n'existe pas
      let { data: existingCouple } = await supabaseAdmin
        .from('couples')
        .select('pair_id')
        .eq('pair_id', pairId)
        .single();

      if (!existingCouple) {
        console.log('🆕 Création nouveau couple...');
        const { error: createError } = await supabaseAdmin
          .from('couples')
          .insert({
            pair_id: pairId,
            initiator_email: `${realRespondent}@temp.com`,
            partner_email: 'partner@temp.com',
            status: 'pending'
          });

        if (createError) {
          console.log('⚠️  Couple existe peut-être déjà:', createError.message);
        }
      }
    } catch (coupleError: any) {
      if (coupleError.message?.includes('does not exist')) {
        console.log('⚠️  Table couples n\'existe pas encore - simulation de sauvegarde');
        return NextResponse.json({ 
          success: true,
          saved: Array.isArray(answers) ? answers.length : 0,
          message: 'Sauvegarde simulée (table couples en cours de création)',
          simulation: true
        });
      }
      throw coupleError;
    }

    // Préparer les réponses
    const responsesToInsert = [];
    let processedCount = 0;
    
    if (Array.isArray(answers)) {
      for (const answer of answers) {
        if (!answer.questionId || answer.value === null || answer.value === undefined) {
          continue;
        }
        
        // Récupérer le type de question
        const { data: question } = await supabaseAdmin
          .from('questions')
          .select('category')
          .eq('id', answer.questionId)
          .single();

        if (!question) {
          console.log(`⚠️  Question ${answer.questionId} introuvable`);
          continue;
        }

      const responseData: any = {
        pair_id: pairId,
        question_id: answer.questionId, // UUID - pas de conversion nécessaire
        respondent: realRespondent,
      };        // Assigner selon le type
        if (question.category === 'bool') {
          responseData.answer_boolean = Boolean(answer.value);
        } else if (question.category === 'scale') {
          responseData.answer_value = Number(answer.value);
        }

        responsesToInsert.push(responseData);
        processedCount++;
      }
    }

    console.log(`📊 Traitement de ${processedCount} réponses valides`);

    // Essayer de sauvegarder les réponses
    try {
      if (responsesToInsert.length > 0) {
        // Supprimer les anciennes réponses de ce participant
        const { error: deleteError } = await supabaseAdmin
          .from('responses')
          .delete()
          .eq('pair_id', pairId)
          .eq('respondent', realRespondent);

        if (deleteError) {
          console.log('⚠️  Erreur suppression anciennes réponses:', deleteError.message);
        }

        // Insérer les nouvelles réponses
        const { error: insertError } = await supabaseAdmin
          .from('responses')
          .insert(responsesToInsert);

        if (insertError) {
          console.error('❌ Erreur insertion réponses:', insertError.message);
          return NextResponse.json({ 
            error: 'Erreur sauvegarde réponses',
            details: insertError.message 
          }, { status: 500 });
        }
      }

      console.log(`✅ ${responsesToInsert.length} réponses sauvegardées avec succès`);
    } catch (responseError: any) {
      if (responseError.message?.includes('does not exist')) {
        console.log('⚠️  Table responses n\'existe pas encore - simulation de sauvegarde');
        return NextResponse.json({ 
          success: true,
          saved: responsesToInsert.length,
          message: 'Sauvegarde simulée (table responses en cours de création)',
          simulation: true
        });
      }
      throw responseError;
    }

    return NextResponse.json({ 
      success: true,
      saved: responsesToInsert.length,
      message: `${responsesToInsert.length} réponses sauvegardées avec succès`
    });

  } catch (error) {
    console.error('❌ Erreur API answers/save:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur interne',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
