// Test d'inscription en direct - NikahScore
// Ce script va tester une vraie inscription utilisateur

const https = require('https');
const http = require('http');

const baseUrl = 'http://localhost:3000';

// Utilisateur de test avec un email unique
const testUser = {
  name: 'Test User Demo',
  email: `demo-${Date.now()}@nikahscore-test.com`,
  password: 'TestPassword123!'
};

console.log('🚀 TEST D\'INSCRIPTION EN DIRECT - NIKAHSCORE');
console.log('=============================================\n');

console.log('👤 Utilisateur de test créé :');
console.log(`   Nom: ${testUser.name}`);
console.log(`   Email: ${testUser.email}`);
console.log(`   Mot de passe: ${testUser.password}\n`);

// Fonction pour faire une requête HTTP
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function testInscription() {
  console.log('📝 Tentative d\'inscription...');
  
  try {
    const response = await makeRequest(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify(testUser));
    
    console.log(`📊 Réponse du serveur (Status: ${response.status}):`);
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 || response.status === 201) {
      console.log('\n✅ INSCRIPTION RÉUSSIE !');
      console.log('🎉 L\'utilisateur a été créé avec succès dans Supabase !');
      
      if (response.data.message) {
        console.log(`💌 Message: ${response.data.message}`);
      }
      
      return true;
    } else {
      console.log('\n⚠️ Réponse inattendue:');
      console.log(`Status: ${response.status}`);
      console.log('Data:', response.data);
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR lors de l\'inscription:');
    console.error(error.message);
    return false;
  }
}

async function testConnexion() {
  console.log('\n🔐 Test de connexion avec les mêmes identifiants...');
  
  try {
    const response = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify({
      email: testUser.email,
      password: testUser.password
    }));
    
    console.log(`📊 Réponse connexion (Status: ${response.status}):`);
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ CONNEXION RÉUSSIE !');
      console.log('🎉 L\'utilisateur peut se connecter !');
      return true;
    } else {
      console.log('\n⚠️ Problème de connexion');
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR lors de la connexion:');
    console.error(error.message);
    return false;
  }
}

async function runCompleteTest() {
  const inscriptionOK = await testInscription();
  
  if (inscriptionOK) {
    const connexionOK = await testConnexion();
    
    console.log('\n============================================');
    console.log('🏁 RÉSULTATS FINAUX:');
    console.log(`✅ Inscription: ${inscriptionOK ? 'SUCCÈS' : 'ÉCHEC'}`);
    console.log(`✅ Connexion: ${connexionOK ? 'SUCCÈS' : 'ÉCHEC'}`);
    
    if (inscriptionOK && connexionOK) {
      console.log('\n🎊 FÉLICITATIONS !');
      console.log('🎯 Votre système d\'authentification fonctionne parfaitement !');
      console.log('👥 Les utilisateurs peuvent s\'inscrire ET se connecter !');
    }
  }
}

// Exécuter le test
runCompleteTest().catch(console.error);