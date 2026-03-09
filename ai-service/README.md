# FindMe AI Service

Python Flask microservice for AI-powered matching using CLIP embeddings and Google Speech-to-Text.

## Features

- Image embedding generation using CLIP
- Text embedding generation
- Cosine similarity matching
- Audio transcription with Google Speech-to-Text
- RESTful API
- GPU support for faster inference

## Tech Stack

- Python 3.11+
- Flask
- PyTorch
- Transformers (CLIP)
- Google Cloud Speech-to-Text
- NumPy

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Set up Google Cloud credentials:
```bash
# Download service account JSON from Google Cloud Console
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

4. Run development server:
```bash
python app.py
```

5. Run production server:
```bash
gunicorn --bind 0.0.0.0:5001 --workers 2 --timeout 120 app:app
```

## Environment Variables

- `FLASK_ENV`: development or production
- `PORT`: Server port (default: 5001)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud service account JSON
- `MODEL_NAME`: CLIP model name (default: openai/clip-vit-base-patch32)

## API Endpoints

### POST /embed
Generate image embedding from URL.

Request:
```json
{
  "image_url": "https://example.com/image.jpg"
}
```

Response:
```json
{
  "success": true,
  "embedding": [0.123, -0.456, ...],
  "dimension": 512
}
```

### POST /embed-text
Generate text embedding.

Request:
```json
{
  "text": "Black iPhone 13 Pro"
}
```

Response:
```json
{
  "success": true,
  "embedding": [0.234, -0.567, ...],
  "dimension": 512
}
```

### POST /match
Find similar items using cosine similarity.

Request:
```json
{
  "query_embedding": [0.123, ...],
  "candidate_embeddings": [
    {"id": "item-1", "embedding": [0.234, ...]},
    {"id": "item-2", "embedding": [0.345, ...]}
  ],
  "threshold": 0.78
}
```

Response:
```json
{
  "success": true,
  "matches": [
    {"index": 0, "id": "item-1", "similarity": 0.85}
  ]
}
```

### POST /transcribe
Transcribe audio to text.

Request:
```json
{
  "audio_url": "https://example.com/audio.webm"
}
```

Response:
```json
{
  "success": true,
  "transcript": "I lost my black iPhone at Central Park"
}
```

## Models

### CLIP (Contrastive Language-Image Pre-training)
- Used for generating embeddings from images and text
- Enables cross-modal matching
- Default model: `openai/clip-vit-base-patch32`
- Output dimension: 512

### Google Speech-to-Text
- Converts audio to text
- Supports multiple languages
- Automatic punctuation

## Performance

- GPU acceleration supported (CUDA)
- Embedding generation: ~100ms per image
- Similarity matching: <10ms for 1000 candidates
- Audio transcription: ~2-5 seconds per minute of audio

## Deployment

Recommended platforms:
- Render (with GPU support)
- Railway
- Google Cloud Run

For GPU support:
- Use CUDA-enabled Docker image
- Allocate sufficient GPU memory
- Consider batch processing for multiple embeddings

## Docker

```bash
# Build image
docker build -t findme-ai-service .

# Run container
docker run -p 5001:5001 --env-file .env findme-ai-service
```

## Scaling

- Horizontal scaling: Deploy multiple instances behind load balancer
- Vertical scaling: Use GPU instances for faster inference
- Caching: Cache embeddings for frequently accessed items
- Batch processing: Process multiple embeddings in parallel

## License

MIT
