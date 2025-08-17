import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// POST /api/couples - Créer une nouvelle paire et envoyer l'invitation
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    const body = await request.json();
    
    const { 
      initiatorEmail, 
      partnerEmail, 
      initiatorName,
      partnerName,
      message 
    } = body;

    // Générer les IDs uniques
    const pairId = uuidv4();
    const inviteToken = uuidv4();

    // Créer le couple dans la DB
    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .insert({
        pair_id: pairId,
        initiator_email: initiatorEmail,
        partner_email: partnerEmail,
        initiator_name: initiatorName,
        partner_name: partnerName,
        invite_token: inviteToken,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (coupleError) {
      console.error('Erreur création couple:', coupleError);
      return NextResponse.json({ error: 'Erreur création couple' }, { status: 500 });
    }

    // Générer le lien d'invitation
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL}/questionnaire?pair=${pairId}&invite=${inviteToken}`;

    // TODO: Envoyer l'email d'invitation (à implémenter avec Resend/SendGrid)
    console.log(`Lien d'invitation généré: ${inviteLink}`);
    console.log(`À envoyer à: ${partnerEmail}`);

    return NextResponse.json({ 
      success: true, 
      pairId,
      inviteLink,
      message: 'Invitation créée avec succès'
    });

  } catch (error) {
    console.error('Erreur API couples:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET /api/couples/[pairId] - Récupérer les infos d'un couple
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pairId = url.searchParams.get('pairId');

    if (!pairId) {
      return NextResponse.json({ error: 'Pair ID requis' }, { status: 400 });
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    
    const { data: couple, error } = await supabase
      .from('couples')
      .select('*')
      .eq('pair_id', pairId)
      .single();

    if (error || !couple) {
      return NextResponse.json({ error: 'Couple introuvable' }, { status: 404 });
    }

    return NextResponse.json(couple);

  } catch (error) {
    console.error('Erreur GET couple:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
