const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  lostItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  foundItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  lostUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foundUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchScore: {
    type: Number,
    required: true
  },
  matchType: {
    type: String,
    enum: ['image', 'text', 'cross-modal', 'hybrid'],
    required: true
  },
  chatRoomId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'resolved'],
    default: 'pending'
  },
  notificationsSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

matchSchema.index({ lostUser: 1, foundUser: 1 });
matchSchema.index({ chatRoomId: 1 });
matchSchema.index({ status: 1 });

module.exports = mongoose.model('Match', matchSchema);
