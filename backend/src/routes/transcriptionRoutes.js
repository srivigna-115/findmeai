const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for audio uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// @route   POST /api/transcribe
// @desc    Transcribe audio to text
// @access  Private
router.post('/', protect, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    // For now, return a simple response since AI service might not be running
    // In production, this would send to the AI service for transcription
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
    
    try {
      // Try to send to AI service
      const transcriptionResponse = await axios.post(`${aiServiceUrl}/transcribe`, {
        audio_data: req.file.buffer.toString('base64'),
        mime_type: req.file.mimetype
      }, {
        timeout: 10000 // 10 second timeout
      });

      const transcript = transcriptionResponse.data.transcript || '';

      res.json({
        success: true,
        transcript: transcript
      });

    } catch (aiError) {
      console.log('AI service not available, returning placeholder');
      // Fallback response when AI service is not available
      res.json({
        success: true,
        transcript: 'Voice transcription will be available when AI service is running. For now, please use the real-time browser transcription.'
      });
    }

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      message: 'Transcription failed',
      error: error.message 
    });
  }
});

module.exports = router;