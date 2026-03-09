const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
  try {
    const matches = await Match.find({
      $or: [{ lostUser: req.user.id }, { foundUser: req.user.id }]
    })
      .populate('lostItem')
      .populate('foundItem')
      .populate('lostUser', 'name email')
      .populate('foundUser', 'name email')
      .sort('-createdAt');

    res.json({ success: true, matches });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('lostItem')
      .populate('foundItem')
      .populate('lostUser', 'name email phone')
      .populate('foundUser', 'name email phone');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check authorization
    if (match.lostUser._id.toString() !== req.user.id && 
        match.foundUser._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, match });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
