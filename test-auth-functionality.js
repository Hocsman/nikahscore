// Script de test des fonctionnalités d'authentification
// Usage: node test-auth-functionality.js

const baseUrl = 'http://localhost:3000';

async function testHealthEndpoint() {
  console.log('🏥 Test API Health...');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    console.log('✅ API Health OK:', data);
    return true;
  } catch (error) {
    console.error('❌ API Health Error:', error.message);
    return false;
  }
}

async function testRegistrationEndpoint() {
  console.log('📝 Test Registration API...');
  try {
    const testUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123'
    };

    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration API OK:', data.message);
      return { success: true, email: testUser.email, password: testUser.password };
    } else {
      console.log('⚠️ Registration Response:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('❌ Registration Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testLoginEndpoint(email, password) {
  console.log('🔐 Test Login API...');
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login API OK:', data.message || 'Login successful');
      return true;
    } else {
      console.log('⚠️ Login Response:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    return false;
  }
}

async function testAuthPages() {
  console.log('📄 Test Auth Pages...');
  const pages = ['/auth', '/auth-fixed', '/auth-simple'];
  
  for (const page of pages) {
    try {
      const response = await fetch(`${baseUrl}${page}`);
      if (response.ok) {
        console.log(`✅ Page ${page} OK (${response.status})`);
      } else {
        console.log(`⚠️ Page ${page} Error (${response.status})`);
      }
    } catch (error) {
      console.error(`❌ Page ${page} Error:`, error.message);
    }
  }
}

async function runTests() {
  console.log('🚀 Début des tests d\'authentification NikahScore');
  console.log('================================================\n');

  // Test 1: Health Check
  const healthOk = await testHealthEndpoint();
  console.log('');

  // Test 2: Pages d'authentification
  await testAuthPages();
  console.log('');

  // Test 3: Registration
  const registrationResult = await testRegistrationEndpoint();
  console.log('');

  // Test 4: Login (si registration OK)
  if (registrationResult.success) {
    await testLoginEndpoint(registrationResult.email, registrationResult.password);
  } else {
    console.log('⏭️ Skip Login test (registration failed)');
  }

  console.log('\n================================================');
  console.log('🏁 Tests terminés');
  
  // Résumé
  console.log('\n📋 RÉSUMÉ:');
  console.log(`- API Health: ${healthOk ? '✅' : '❌'}`);
  console.log(`- Registration: ${registrationResult.success ? '✅' : '❌'}`);
  
  if (healthOk && registrationResult.success) {
    console.log('🎉 Système d\'authentification fonctionnel !');
  } else {
    console.log('⚠️ Problèmes détectés - voir détails ci-dessus');
  }
}

// Exécuter les tests
runTests().catch(console.error);