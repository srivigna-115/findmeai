const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  type: {
    type: String,
    enum: ['text', 'image', 'system'],
    default: 'text'
  }
}, {
  timestamps: true
});

messageSchema.index({ chatRoomId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
