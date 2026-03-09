import torch
import numpy as np
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import requests
from io import BytesIO
import os

class EmbeddingService:
    def __init__(self):
        model_name = os.getenv('MODEL_NAME', 'openai/clip-vit-base-patch32')
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)
        self.model.eval()
        
    def get_image_embedding(self, image_url):
        """Generate normalized embedding from image URL"""
        try:
            # Download image
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content)).convert('RGB')
            
            # Process and get embedding
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                image_features = self.model.get_image_features(**inputs)
                
            # Normalize
            embedding = image_features / image_features.norm(dim=-1, keepdim=True)
            
            return embedding.cpu().numpy().flatten()
            
        except Exception as e:
            raise Exception(f"Failed to generate image embedding: {str(e)}")
    
    def get_text_embedding(self, text):
        """Generate normalized embedding from text"""
        try:
            inputs = self.processor(text=[text], return_tensors="pt", padding=True).to(self.device)
            
            with torch.no_grad():
                text_features = self.model.get_text_features(**inputs)
                
            # Normalize
            embedding = text_features / text_features.norm(dim=-1, keepdim=True)
            
            return embedding.cpu().numpy().flatten()
            
        except Exception as e:
            raise Exception(f"Failed to generate text embedding: {str(e)}")
