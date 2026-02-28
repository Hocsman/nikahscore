import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE() {
    try {
        const supabase = await createClient()

        // Vérifier l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            )
        }

        const userId = user.id

        console.log(`🗑️ Début suppression compte pour utilisateur ${userId}`)

        // 1. Supprimer les réponses aux questionnaires
        const { error: responsesError } = await supabase
            .from('questionnaire_responses')
            .delete()
            .eq('user_id', userId)

        if (responsesError) {
            console.error('Erreur suppression réponses:', responsesError)
        }

        // 2. Supprimer les couples où l'utilisateur est créateur
        const { error: couplesCreatorError } = await supabase
            .from('couples')
            .delete()
            .eq('creator_id', userId)

        if (couplesCreatorError) {
            console.error('Erreur suppression couples (creator):', couplesCreatorError)
        }

        // 3. Mettre à null le partner_id des couples où l'utilisateur est partenaire
        const { error: couplesPartnerError } = await supabase
            .from('couples')
            .update({ partner_id: null })
            .eq('partner_id', userId)

        if (couplesPartnerError) {
            console.error('Erreur mise à jour couples (partner):', couplesPartnerError)
        }

        // 4. Supprimer les résultats de compatibilité liés
        // (Si la table existe et a une relation avec l'utilisateur)
        try {
            await supabase
                .from('user_subscriptions')
                .delete()
                .eq('user_id', userId)
        } catch (e) {
            console.log('Table user_subscriptions peut-être inexistante')
        }

        // 5. Supprimer les événements analytics
        try {
            await supabase
                .from('analytics_events')
                .delete()
                .eq('user_id', userId)
        } catch (e) {
            console.log('Table analytics_events peut-être inexistante')
        }

        // 6. Supprimer le profil
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId)

        if (profileError) {
            console.error('Erreur suppression profil:', profileError)
        }

        // 7. Supprimer l'utilisateur auth via le client admin (service role)
        const supabaseAdmin = createAdminClient()
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (authDeleteError) {
            console.error('Erreur suppression auth user:', authDeleteError)
        }

        console.log(`✅ Compte utilisateur ${userId} entièrement supprimé (données + auth)`)

        return NextResponse.json({
            success: true,
            message: 'Compte supprimé avec succès'
        })

    } catch (error) {
        console.error('❌ Erreur suppression compte:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du compte' },
            { status: 500 }
        )
    }
}
