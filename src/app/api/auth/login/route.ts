import { NextRequest, NextResponse } from 'next/server'

// Récupérer les utilisateurs du storage (en production, utiliser une vraie base de données)
const getUsers = () => {
  // Simuler une base d'utilisateurs pour la démonstration
  const users = new Map<string, { 
    id: string, 
    name: string, 
    email: string, 
    password: string, 
    createdAt: Date 
  }>()
  
  // Ajouter un utilisateur de test
  users.set('test@nikahscore.com', {
    id: '1',
    name: 'Utilisateur Test',
    email: 'test@nikahscore.com',
    password: 'password123', // En production: hash
    createdAt: new Date()
  })
  
  return users
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const users = getUsers()
    const user = users.get(email)

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 401 }
      )
    }

    // En production: await bcrypt.compare(password, user.password)
    if (password !== user.password) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Créer une session simple (en production, utiliser JWT ou sessions sécurisées)
    const sessionToken = Date.now().toString()

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: sessionToken
    })

  } catch (error) {
    console.error('Erreur connexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
