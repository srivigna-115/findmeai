const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

exports.getEmbedding = async (imageUrl) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/embed`, {
      image_url: imageUrl
    });
    return response.data.embedding;
  } catch (error) {
    console.error('AI Service embedding error:', error.message);
    throw new Error('Failed to generate embedding');
  }
};

exports.transcribeAudio = async (audioUrl) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/transcribe`, {
      audio_url: audioUrl
    });
    return response.data.transcript;
  } catch (error) {
    console.error('AI Service transcription error:', error.message);
    throw new Error('Failed to transcribe audio');
  }
};

exports.findSimilarItems = async (queryEmbedding, candidateEmbeddings) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/match`, {
      query_embedding: queryEmbedding,
      candidate_embeddings: candidateEmbeddings
    });
    return response.data.matches;
  } catch (error) {
    console.error('AI Service matching error:', error.message);
    throw new Error('Failed to find matches');
  }
};
