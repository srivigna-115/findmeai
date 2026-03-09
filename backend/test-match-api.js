const axios = require('axios');

async function testMatchAPI() {
  try {
    // First, login to get a token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'srivignapalnati007@gmail.com',
      password: 'password123'
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful');

    // Get matches
    const matchRes = await axios.get('http://localhost:5000/api/matches', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('\n📊 Match API Response:');
    console.log(JSON.stringify(matchRes.data, null, 2));

    if (matchRes.data.matches && matchRes.data.matches.length > 0) {
      const match = matchRes.data.matches[0];
      console.log('\n🔍 First Match Details:');
      console.log('Lost Item Image URL:', match.lostItem?.imageUrl || 'NONE');
      console.log('Found Item Image URL:', match.foundItem?.imageUrl || 'NONE');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testMatchAPI();
