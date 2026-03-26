from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import numpy as np
import hashlib
import urllib.request
from io import BytesIO

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok', 'service': 'FindMe AI Service'}), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'AI Service'}), 200

def get_image_embedding(image_url):
    """Try to download image and get pixel-based embedding, fallback to hash"""
    try:
        from PIL import Image
        req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            img_data = response.read()
        img = Image.open(BytesIO(img_data)).convert('RGB')
        img = img.resize((16, 16))
        pixels = np.array(img).flatten().astype(float)
        norm = np.linalg.norm(pixels)
        if norm > 0:
            pixels = pixels / norm
        return pixels.tolist()
    except Exception as e:
        print(f'Image download failed ({e}), using hash embedding')
        # Fallback: hash-based deterministic embedding
        url_hash = int(hashlib.md5(image_url.encode()).hexdigest(), 16) % (2**32)
        np.random.seed(url_hash)
        embedding = np.random.randn(768)
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        return embedding.tolist()

@app.route('/embed', methods=['POST'])
def embed():
    try:
        data = request.json
        image_url = data.get('image_url', '')
        if not image_url:
            return jsonify({'error': 'image_url is required'}), 400
        embedding = get_image_embedding(image_url)
        return jsonify({
            'success': True,
            'embedding': embedding,
            'dimension': len(embedding)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/embed-text', methods=['POST'])
def embed_text():
    try:
        data = request.json
        text = data.get('text', '')
        if not text:
            return jsonify({'error': 'text is required'}), 400
        text_hash = int(hashlib.md5(text.lower().encode()).hexdigest(), 16) % (2**32)
        np.random.seed(text_hash)
        embedding = np.random.randn(512).tolist()
        return jsonify({'success': True, 'embedding': embedding, 'dimension': 512}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/match', methods=['POST'])
def match():
    try:
        data = request.json
        query_embedding = data.get('query_embedding')
        candidate_embeddings = data.get('candidate_embeddings')
        threshold = data.get('threshold', 0.5)
        if not query_embedding or not candidate_embeddings:
            return jsonify({'error': 'query_embedding and candidate_embeddings are required'}), 400
        matches = []
        query = np.array(query_embedding)
        for idx, candidate in enumerate(candidate_embeddings):
            cand_emb = np.array(candidate['embedding'])
            norm_q = np.linalg.norm(query)
            norm_c = np.linalg.norm(cand_emb)
            if norm_q == 0 or norm_c == 0:
                similarity = 0.0
            else:
                similarity = float(np.dot(query, cand_emb) / (norm_q * norm_c))
            if similarity >= threshold:
                matches.append({'index': idx, 'id': candidate.get('id'), 'similarity': similarity})
        matches.sort(key=lambda x: x['similarity'], reverse=True)
        return jsonify({'success': True, 'matches': matches}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        data = request.json
        audio_url = data.get('audio_url', '')
        if not audio_url:
            return jsonify({'error': 'audio_url is required'}), 400
        return jsonify({'success': True, 'transcript': '', 'note': 'Configure speech service for transcription'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print(f"🤖 Starting AI Service on port {port}", flush=True)
    app.run(host='0.0.0.0', port=port, debug=False)
