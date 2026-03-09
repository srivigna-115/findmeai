import numpy as np

class MatchingService:
    def cosine_similarity(self, vec_a, vec_b):
        """Calculate cosine similarity between two vectors"""
        vec_a = np.array(vec_a)
        vec_b = np.array(vec_b)
        
        dot_product = np.dot(vec_a, vec_b)
        norm_a = np.linalg.norm(vec_a)
        norm_b = np.linalg.norm(vec_b)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
            
        return float(dot_product / (norm_a * norm_b))
    
    def find_matches(self, query_embedding, candidate_embeddings, threshold=0.78):
        """Find all candidates above similarity threshold"""
        matches = []
        
        for idx, candidate in enumerate(candidate_embeddings):
            similarity = self.cosine_similarity(query_embedding, candidate['embedding'])
            
            if similarity >= threshold:
                matches.append({
                    'index': idx,
                    'id': candidate.get('id'),
                    'similarity': similarity
                })
        
        # Sort by similarity descending
        matches.sort(key=lambda x: x['similarity'], reverse=True)
        
        return matches
