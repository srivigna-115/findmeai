const Item = require('../models/Item');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { getEmbedding, transcribeAudio } = require('../services/aiService');
const { findMatches } = require('../services/matchingService');

exports.createItem = async (req, res, next) => {
  try {
    const { type, title, description, verificationInfo, category, date, location } = req.body;
    
    const itemData = {
      user: req.user.id,
      type,
      title,
      description,
      category,
      date,
      location: JSON.parse(location)
    };

    // Add verification info if provided (for lost items)
    if (verificationInfo) {
      itemData.verificationInfo = verificationInfo;
    }

    // Handle image upload
    if (req.files && req.files.image) {
      const imageUrl = await uploadToCloudinary(req.files.image[0]);
      itemData.imageUrl = imageUrl;
      
      // Only get image embedding if we have a real image URL (not placeholder)
      if (imageUrl && !imageUrl.includes('placeholder')) {
        try {
          const embedding = await getEmbedding(imageUrl);
          itemData.imageEmbedding = embedding;
        } catch (error) {
          console.log('Warning: Could not generate image embedding:', error.message);
          // Continue without embedding - will use text matching
        }
      }
    }

    // Handle audio upload
    if (req.files && req.files.audio) {
      try {
        const audioUrl = await uploadToCloudinary(req.files.audio[0]);
        itemData.audioUrl = audioUrl;
        const transcript = await transcribeAudio(audioUrl);
        itemData.audioTranscript = transcript;
        // Only use transcript as description if no text description provided
        if (!itemData.description || itemData.description.trim() === '') {
          itemData.description = transcript;
        }
      } catch (err) {
        console.log('Audio processing failed:', err.message);
      }
    }

    const item = await Item.create(itemData);

    // Trigger async matching - populate user first to ensure matching works
    Item.findById(item._id).populate('user', '_id name email').then(populatedItem => {
      if (populatedItem) {
        findMatches(populatedItem).catch(err => console.error('Matching error:', err));
      }
    }).catch(err => console.error('Error populating item for matching:', err));

    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    const { type, category, status } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const items = await Item.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt');

    res.json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

exports.getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ user: req.user.id })
      .sort('-createdAt');

    res.json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.deleteOne();

    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    next(error);
  }
};
