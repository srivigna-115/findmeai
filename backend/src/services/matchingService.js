const Item = require('../models/Item');
const Match = require('../models/Match');
const { v4: uuidv4 } = require('uuid');
const { findSimilarItems } = require('./aiService');
const { sendMatchNotifications } = require('./notificationService');

const IMAGE_THRESHOLD = parseFloat(process.env.IMAGE_SIMILARITY_THRESHOLD) || 0.78;
const TEXT_THRESHOLD = parseFloat(process.env.TEXT_SIMILARITY_THRESHOLD) || 0.10;

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

exports.findMatches = async (newItem) => {
  try {
    console.log(`🔍 Starting match search for item: ${newItem.title} (${newItem.type})`);
    
    // Determine opposite type
    const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
    console.log(`   Looking for ${oppositeType} items in category: ${newItem.category}`);

    // Find active items of opposite type in same category
    const candidates = await Item.find({
      type: oppositeType,
      category: newItem.category,
      status: 'active',
      _id: { $ne: newItem._id }
    });

    console.log(`   Found ${candidates.length} candidate(s)`);

    if (candidates.length === 0) {
      console.log('   ❌ No candidates found for matching');
      return;
    }

    for (const candidate of candidates) {
      console.log(`   📝 Comparing with: ${candidate.title}`);
      let matchScore = 0;
      let matchType = '';
      
      const hasNewItemImage = newItem.imageEmbedding && 
                              Array.isArray(newItem.imageEmbedding) && 
                              newItem.imageEmbedding.length > 0;
      const hasCandidateImage = candidate.imageEmbedding && 
                                Array.isArray(candidate.imageEmbedding) && 
                                candidate.imageEmbedding.length > 0;

      // Calculate text similarity (always needed)
      const text1 = `${newItem.title} ${newItem.description}`;
      const text2 = `${candidate.title} ${candidate.description}`;
      const textScore = calculateTextSimilarity(text1, text2);
      console.log(`      Text similarity: ${(textScore * 100).toFixed(2)}%`);

      // Both items have images: Average of image + text similarity
      if (hasNewItemImage && hasCandidateImage) {
        try {
          const imageScore = cosineSimilarity(newItem.imageEmbedding, candidate.imageEmbedding);
          if (isNaN(imageScore) || !isFinite(imageScore)) {
            throw new Error('Invalid similarity score');
          }
          console.log(`      Image similarity: ${(imageScore * 100).toFixed(2)}%`);
          
          // Average of both scores
          matchScore = (imageScore + textScore) / 2;
          matchType = 'hybrid';
          console.log(`      Hybrid score (avg): ${(matchScore * 100).toFixed(2)}%`);
        } catch (error) {
          console.log(`      Image matching failed, using text only: ${error.message}`);
          matchScore = textScore;
          matchType = 'text';
        }
      }
      // Only one or no images: Use text similarity only
      else {
        matchScore = textScore;
        matchType = 'text';
        console.log(`      Using text-only matching`);
      }

      // Check threshold
      const threshold = matchType === 'image' ? IMAGE_THRESHOLD : TEXT_THRESHOLD;
      console.log(`      Threshold: ${(threshold * 100).toFixed(2)}%`);
      
      if (matchScore >= threshold) {
        console.log(`   ✅ MATCH FOUND! Score: ${(matchScore * 100).toFixed(2)}%`);
        await createMatch(newItem, candidate, matchScore, matchType);
      } else {
        console.log(`   ❌ Score too low: ${(matchScore * 100).toFixed(2)}% < ${(threshold * 100).toFixed(2)}%`);
      }
    }
  } catch (error) {
    console.error('❌ Matching service error:', error);
    throw error;
  }
};

const createMatch = async (item1, item2, matchScore, matchType) => {
  try {
    const lostItem = item1.type === 'lost' ? item1 : item2;
    const foundItem = item1.type === 'found' ? item1 : item2;

    const chatRoomId = uuidv4();

    console.log(`   💾 Creating match record...`);
    const match = await Match.create({
      lostItem: lostItem._id,
      foundItem: foundItem._id,
      lostUser: lostItem.user,
      foundUser: foundItem.user,
      matchScore,
      matchType,
      chatRoomId
    });

    console.log(`   ✅ Match created with ID: ${match._id}`);

    // Update items status
    await Item.findByIdAndUpdate(lostItem._id, {
      status: 'matched',
      matchedWith: foundItem._id,
      matchScore
    });

    await Item.findByIdAndUpdate(foundItem._id, {
      status: 'matched',
      matchedWith: lostItem._id,
      matchScore
    });

    console.log(`   📧 Sending notifications...`);
    // Send notifications
    await sendMatchNotifications(match);
    console.log(`   ✅ Match process complete!`);

    return match;
  } catch (error) {
    console.error('   ❌ Error creating match:', error);
    throw error;
  }
};

const calculateTextSimilarity = (text1, text2) => {
  // Enhanced semantic text similarity with contextual understanding
  
  // Common synonyms and related terms for lost & found items
  const synonymGroups = {
    phone: ['phone', 'mobile', 'cell', 'smartphone', 'iphone', 'android', 'device'],
    bottle: ['bottle', 'flask', 'container', 'thermos', 'tumbler'],
    wallet: ['wallet', 'purse', 'billfold', 'pouch'],
    bag: ['bag', 'backpack', 'purse', 'satchel', 'tote', 'handbag'],
    key: ['key', 'keys', 'keychain', 'keyring'],
    watch: ['watch', 'timepiece', 'smartwatch', 'wristwatch'],
    laptop: ['laptop', 'computer', 'notebook', 'macbook'],
    card: ['card', 'id', 'license', 'credit', 'debit'],
    glasses: ['glasses', 'spectacles', 'eyeglasses', 'sunglasses', 'shades'],
    jewelry: ['jewelry', 'ring', 'necklace', 'bracelet', 'earring', 'pendant']
  };
  
  const normalize = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2); // Remove short words
  };

  const words1 = normalize(text1);
  const words2 = normalize(text2);
  
  // Expand words with synonyms for semantic matching
  const expandWithSynonyms = (words) => {
    const expanded = new Set(words);
    words.forEach(word => {
      Object.values(synonymGroups).forEach(group => {
        if (group.includes(word)) {
          group.forEach(syn => expanded.add(syn));
        }
      });
    });
    return expanded;
  };
  
  const expandedSet1 = expandWithSynonyms(words1);
  const expandedSet2 = expandWithSynonyms(words2);
  
  // Calculate semantic Jaccard similarity with synonym expansion
  const intersection = new Set([...expandedSet1].filter(x => expandedSet2.has(x)));
  const union = new Set([...expandedSet1, ...expandedSet2]);
  const semanticJaccard = intersection.size / union.size;
  
  // Calculate exact word frequency overlap (TF-based cosine)
  const freq1 = {};
  const freq2 = {};
  
  words1.forEach(w => freq1[w] = (freq1[w] || 0) + 1);
  words2.forEach(w => freq2[w] = (freq2[w] || 0) + 1);
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  const allUniqueWords = new Set([...words1, ...words2]);
  allUniqueWords.forEach(word => {
    const f1 = freq1[word] || 0;
    const f2 = freq2[word] || 0;
    dotProduct += f1 * f2;
    mag1 += f1 * f1;
    mag2 += f2 * f2;
  });
  
  const exactCosine = mag1 && mag2 ? dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2)) : 0;
  
  // N-gram similarity for partial word matches (e.g., "milton" matches "milton steel")
  const getNgrams = (words, n = 2) => {
    const ngrams = [];
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(' '));
    }
    return ngrams;
  };
  
  const bigrams1 = new Set(getNgrams(words1, 2));
  const bigrams2 = new Set(getNgrams(words2, 2));
  const bigramIntersection = new Set([...bigrams1].filter(x => bigrams2.has(x)));
  const bigramUnion = new Set([...bigrams1, ...bigrams2]);
  const ngramScore = bigramUnion.size > 0 ? bigramIntersection.size / bigramUnion.size : 0;
  
  // Weighted combination: semantic understanding + exact matches + partial matches
  const finalScore = (semanticJaccard * 0.5) + (exactCosine * 0.3) + (ngramScore * 0.2);
  
  console.log(`      📊 Semantic: ${(semanticJaccard * 100).toFixed(2)}%, Exact: ${(exactCosine * 100).toFixed(2)}%, N-gram: ${(ngramScore * 100).toFixed(2)}%, Final: ${(finalScore * 100).toFixed(2)}%`);
  
  return finalScore;
};
