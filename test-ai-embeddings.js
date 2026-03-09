// Test AI service embeddings
const axios = require('axios');

const testEmbeddings = async () => {
  console.log('🧪 Testing AI Service Embeddings\n');
  
  const testUrl = 'https://via.placeholder.com/400x300?text=Demo+Image';
  
  try {
    // Get embedding twice for same URL
    console.log('📤 Requesting embedding for:', testUrl);
    const res1 = await axios.post('http://localhost:5001/embed', {
      image_url: testUrl
    });
    
    console.log('📤 Requesting embedding again for same URL...');
    const res2 = await axios.post('http://localhost:5001/embed', {
      image_url: testUrl
    });
    
    const emb1 = res1.data.embedding;
    const emb2 = res2.data.embedding;
    
    console.log('\n📊 Results:');
    console.log('  Embedding 1 length:', emb1.length);
    console.log('  Embedding 2 length:', emb2.length);
    console.log('  First 5 values of emb1:', emb1.slice(0, 5));
    console.log('  First 5 values of emb2:', emb2.slice(0, 5));
    
    // Check if embeddings are identical
    const identical = emb1.every((val, idx) => val === emb2[idx]);
    console.log('\n✅ Embeddings identical:', identical);
    
    // Calculate cosine similarity
    const dotProduct = emb1.reduce((sum, val, idx) => sum + val * emb2[idx], 0);
    const mag1 = Math.sqrt(emb1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(emb2.reduce((sum, val) => sum + val * val, 0));
    const similarity = dotProduct / (mag1 * mag2);
    
    console.log('📈 Cosine similarity:', (similarity * 100).toFixed(2) + '%');
    
    if (similarity > 0.99) {
      console.log('\n✅ SUCCESS: Same URL produces same embedding!');
      console.log('   Image matching should work correctly now.');
    } else {
      console.log('\n❌ PROBLEM: Same URL produces different embeddings!');
      console.log('   AI service may not be using deterministic embeddings.');
    }
    
    // Test different URL
    console.log('\n📤 Testing different URL...');
    const res3 = await axios.post('http://localhost:5001/embed', {
      image_url: 'https://via.placeholder.com/400x300?text=Different+Image'
    });
    
    const emb3 = res3.data.embedding;
    const dotProduct2 = emb1.reduce((sum, val, idx) => sum + val * emb3[idx], 0);
    const mag3 = Math.sqrt(emb3.reduce((sum, val) => sum + val * val, 0));
    const similarity2 = dotProduct2 / (mag1 * mag3);
    
    console.log('📈 Similarity with different URL:', (similarity2 * 100).toFixed(2) + '%');
    console.log('   (Should be low, around 0-10%)');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   AI service is not running on port 5001');
    }
  }
};

console.log('═══════════════════════════════════════════════════════');
console.log('  AI Service Embedding Test');
console.log('═══════════════════════════════════════════════════════\n');

testEmbeddings();
