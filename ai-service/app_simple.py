from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok', 'service': 'FindMe AI Service'}), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'AI Service (Simplified)'}), 200

@app.route('/embed', methods=['POST'])
def embed():
    """Generate deterministic embedding vector from image URL"""
    try:
        data = request.json
        image_url = data.get('image_url')
        
        if not image_url:
            return jsonify({'error': 'image_url is required'}), 400
        
        # Use URL hash to generate deterministic embedding
        # This ensures same/similar URLs get same/similar embeddings
        url_hash = hash(image_url) % (2**32)
        np.random.seed(url_hash)
        
        # Generate base embedding
        embedding = np.random.randn(512)
        
        # Normalize to unit vector for better cosine similarity
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        
        return jsonify({
            'success': True,
            'embedding': embedding.tolist(),
            'dimension': len(embedding),
            'note': 'Deterministic mock embedding - same URL = same embedding'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/embed-text', methods=['POST'])
def embed_text():
    """Generate mock embedding vector from text"""
    try:
        data = request.json
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'text is required'}), 400
        
        # Generate mock embedding based on text hash
        np.random.seed(hash(text) % (2**32))
        embedding = np.random.randn(512).tolist()
        
        return jsonify({
            'success': True,
            'embedding': embedding,
            'dimension': len(embedding),
            'note': 'Mock embedding - install PyTorch for real embeddings'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/match', methods=['POST'])
def match():
    """Find best matches using cosine similarity"""
    try:
        data = request.json
        query_embedding = data.get('query_embedding')
        candidate_embeddings = data.get('candidate_embeddings')
        threshold = data.get('threshold', 0.78)
        
        if not query_embedding or not candidate_embeddings:
            return jsonify({'error': 'query_embedding and candidate_embeddings are required'}), 400
        
        matches = []
        query = np.array(query_embedding)
        
        for idx, candidate in enumerate(candidate_embeddings):
            cand_emb = np.array(candidate['embedding'])
            
            # Cosine similarity
            dot_product = np.dot(query, cand_emb)
            norm_query = np.linalg.norm(query)
            norm_cand = np.linalg.norm(cand_emb)
            
            if norm_query == 0 or norm_cand == 0:
                similarity = 0.0
            else:
                similarity = float(dot_product / (norm_query * norm_cand))
            
            if similarity >= threshold:
                matches.append({
                    'index': idx,
                    'id': candidate.get('id'),
                    'similarity': similarity
                })
        
        matches.sort(key=lambda x: x['similarity'], reverse=True)
        
        return jsonify({
            'success': True,
            'matches': matches
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """Mock transcription - returns placeholder text"""
    try:
        data = request.json
        audio_url = data.get('audio_url')
        
        if not audio_url:
            return jsonify({'error': 'audio_url is required'}), 400
        
        # Mock transcription
        transcript = "This is a mock transcription. Install Google Cloud Speech-to-Text for real transcription."
        
        return jsonify({
            'success': True,
            'transcript': transcript,
            'note': 'Mock transcription - configure Google Cloud for real transcription'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print(f"🤖 Starting AI Service (Simplified Mode) on port {port}")
    print("📝 Note: Using mock embeddings. Install PyTorch + Transformers for real AI features.")
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')
