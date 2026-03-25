const Item = require('../models/Item');
const Match = require('../models/Match');
const { v4: uuidv4 } = require('uuid');
const { findSimilarItems } = require('./aiService');
const { sendMatchNotifications } = require('./notificationService');

const IMAGE_THRESHOLD = parseFloat(process.env.IMAGE_SIMILARITY_THRESHOLD) || 0.001;
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
    }).populate('user', '_id name email');

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
      const textScore = calculateTextSimilarity(text1, text2, newItem.title, candidate.title);
      console.log(`      Text similarity: ${(textScore * 100).toFixed(2)}%`);

      // Both items have images: use best of image or text
      if (hasNewItemImage && hasCandidateImage) {
        try {
          const rawImageScore = cosineSimilarity(newItem.imageEmbedding, candidate.imageEmbedding);
          const imageScore = Math.max(0, rawImageScore);
          console.log(`      Image similarity: ${(imageScore * 100).toFixed(2)}%`);
          // Use best score between image and text
          matchScore = Math.max(imageScore, textScore);
          matchType = 'hybrid';
        } catch (error) {
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
      lostUser: lostItem.user?._id || lostItem.user,
      foundUser: foundItem.user?._id || foundItem.user,
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

const calculateTextSimilarity = (text1, text2, title1 = '', title2 = '') => {
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
    jewelry: ['jewelry', 'ring', 'necklace', 'bracelet', 'earring', 'pendant'],
    earphones: ['earpods', 'earphones', 'earbuds', 'headphones', 'airpods', 'headset'],
    charger: ['charger', 'adapter', 'cable', 'charging', 'power']
  };

  const normalize = (text) => text.toLowerCase()
    .replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 1);

  const expandWithSynonyms = (words) => {
    const expanded = new Set(words);
    words.forEach(word => {
      Object.values(synonymGroups).forEach(group => {
        if (group.includes(word)) group.forEach(syn => expanded.add(syn));
      });
    });
    return expanded;
  };

  const jaccardScore = (set1, set2) => {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size > 0 ? intersection.size / union.size : 0;
  };

  // Title similarity (most important)
  const titleWords1 = expandWithSynonyms(normalize(title1 || text1));
  const titleWords2 = expandWithSynonyms(normalize(title2 || text2));
  const titleScore = jaccardScore(titleWords1, titleWords2);

  // Full text similarity
  const words1 = expandWithSynonyms(normalize(text1));
  const words2 = expandWithSynonyms(normalize(text2));
  const textScore = jaccardScore(words1, words2);

  // Boost: if any key word from title1 appears in title2, add bonus
  const titleWords1Arr = normalize(title1 || text1);
  const titleWords2Arr = normalize(title2 || text2);
  const titleOverlap = titleWords1Arr.filter(w => titleWords2Arr.includes(w)).length;
  const titleBonus = titleOverlap > 0 ? Math.min(titleOverlap * 0.15, 0.4) : 0;

  // Final: title is 60%, full text 40%, plus title keyword bonus
  const finalScore = Math.min((titleScore * 0.6) + (textScore * 0.4) + titleBonus, 1.0);

  console.log(`      📊 Title: ${(titleScore*100).toFixed(1)}%, Text: ${(textScore*100).toFixed(1)}%, Bonus: ${(titleBonus*100).toFixed(1)}%, Final: ${(finalScore*100).toFixed(1)}%`);
  return finalScore;
};
