from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from services.embedding_service import EmbeddingService
from services.transcription_service import TranscriptionService
from services.matching_service import MatchingService

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize services
embedding_service = EmbeddingService()
transcription_service = TranscriptionService()
matching_service = MatchingService()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'AI Service'}), 200

@app.route('/embed', methods=['POST'])
def embed():
    """Generate embedding vector from image URL"""
    try:
        data = request.json
        image_url = data.get('image_url')
        
        if not image_url:
            return jsonify({'error': 'image_url is required'}), 400
        
        embedding = embedding_service.get_image_embedding(image_url)
        
        return jsonify({
            'success': True,
            'embedding': embedding.tolist(),
            'dimension': len(embedding)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/embed-text', methods=['POST'])
def embed_text():
    """Generate embedding vector from text"""
    try:
        data = request.json
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'text is required'}), 400
        
        embedding = embedding_service.get_text_embedding(text)
        
        return jsonify({
            'success': True,
            'embedding': embedding.tolist(),
            'dimension': len(embedding)
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
        
        matches = matching_service.find_matches(
            query_embedding,
            candidate_embeddings,
            threshold
        )
        
        return jsonify({
            'success': True,
            'matches': matches
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """Transcribe audio file to text"""
    try:
        data = request.json
        audio_url = data.get('audio_url')
        
        if not audio_url:
            return jsonify({'error': 'audio_url is required'}), 400
        
        transcript = transcription_service.transcribe_audio(audio_url)
        
        return jsonify({
            'success': True,
            'transcript': transcript
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')
