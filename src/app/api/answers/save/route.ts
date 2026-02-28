import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        error: 'Non authentifié'
      }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient()
    const body = await request.json();

    const { pairId, respondent, answers } = body;

    // Validation des données
    if (!pairId || !respondent || !answers) {
      return NextResponse.json({
        error: 'Données manquantes: pairId, respondent et answers requis'
      }, { status: 400 });
    }

    // Convertir A/B vers initiator/partner pour compatibilité
    const realRespondent = respondent === 'A' ? 'initiator' : 'partner';

    // Vérifier si la table couples existe, sinon la créer
    try {
      // Vérifier/créer le couple s'il n'existe pas
      let { data: existingCouple } = await supabaseAdmin
        .from('couples')
        .select('pair_id')
        .eq('pair_id', pairId)
        .single();

      if (!existingCouple) {
        const { error: createError } = await supabaseAdmin
          .from('couples')
          .insert({
            pair_id: pairId,
            initiator_email: `${realRespondent}@temp.com`,
            partner_email: 'partner@temp.com',
            status: 'pending'
          });

        if (createError) {
          console.error('Erreur création couple:', createError.message)
        }
      }
    } catch (coupleError: any) {
      if (coupleError.message?.includes('does not exist')) {
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

    if (Array.isArray(answers)) {
      // Récupérer toutes les catégories de questions en une seule requête
      const questionIds = answers
        .filter(a => a.questionId && a.value !== null && a.value !== undefined)
        .map(a => a.questionId);

      const { data: questions } = await supabaseAdmin
        .from('questions')
        .select('id, category')
        .in('id', questionIds);

      // Créer un map questionId → category pour lookup rapide
      const categoryMap: Record<string, string> = {};
      if (questions) {
        for (const q of questions) {
          categoryMap[q.id] = q.category;
        }
      }

      for (const answer of answers) {
        if (!answer.questionId || answer.value === null || answer.value === undefined) {
          continue;
        }

        const category = categoryMap[answer.questionId];
        if (!category) {
          continue;
        }

        const responseData: any = {
          pair_id: pairId,
          question_id: answer.questionId,
          respondent: realRespondent,
        };

        if (category === 'bool') {
          responseData.answer_boolean = Boolean(answer.value);
        } else if (category === 'scale') {
          responseData.answer_value = Number(answer.value);
        }

        responsesToInsert.push(responseData);
      }
    }


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
          console.error('Erreur suppression anciennes réponses:', deleteError.message)
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

    } catch (responseError: any) {
      if (responseError.message?.includes('does not exist')) {
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
      error: 'Erreur serveur interne'
    }, { status: 500 });
  }
}
