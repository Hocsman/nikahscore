// Test direct de l'API d'inscription
// À exécuter dans la console du navigateur sur http://localhost:3000

async function testInscription() {
  try {
    console.log('🚀 Test inscription...')
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'hocsman92@gmail.com',
        password: 'test123456'
      })
    })
    
    const result = await response.json()
    
    console.log('📊 Status:', response.status)
    console.log('📋 Response:', result)
    
    if (!response.ok) {
      console.error('❌ Erreur:', result.error)
    } else {
      console.log('✅ Inscription réussie:', result.message)
    }
    
  } catch (error) {
    console.error('💥 Erreur réseau:', error)
  }
}

// Lancer le test
testInscription()
