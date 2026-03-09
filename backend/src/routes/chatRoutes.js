const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');

router.get('/:chatRoomId/messages', protect, async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;

    // Verify user has access to this chat room
    const match = await Match.findOne({ chatRoomId });
    if (!match) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (match.lostUser.toString() !== req.user.id && 
        match.foundUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ chatRoomId })
      .populate('sender', 'name')
      .sort('createdAt');

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
});

router.post('/:chatRoomId/read', protect, async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;

    await Message.updateMany(
      { chatRoomId, sender: { $ne: req.user.id } },
      { $addToSet: { readBy: req.user.id } }
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
