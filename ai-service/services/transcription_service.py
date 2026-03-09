from google.cloud import speech
import requests
import os

class TranscriptionService:
    def __init__(self):
        # Initialize Google Speech client
        self.client = speech.SpeechClient()
        
    def transcribe_audio(self, audio_url):
        """Transcribe audio file from URL to text"""
        try:
            # Download audio file
            response = requests.get(audio_url, timeout=30)
            response.raise_for_status()
            audio_content = response.content
            
            # Configure recognition
            audio = speech.RecognitionAudio(content=audio_content)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                sample_rate_hertz=48000,
                language_code="en-US",
                enable_automatic_punctuation=True,
                model="default"
            )
            
            # Perform transcription
            response = self.client.recognize(config=config, audio=audio)
            
            # Extract transcript
            transcript = ""
            for result in response.results:
                transcript += result.alternatives[0].transcript + " "
            
            return transcript.strip()
            
        except Exception as e:
            raise Exception(f"Failed to transcribe audio: {str(e)}")
