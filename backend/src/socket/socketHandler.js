const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Match = require('../models/Match');
const User = require('../models/User');
const Notification = require('../models/Notification');

const connectedUsers = new Map();

exports.initializeSocket = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.userName = user.name;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    connectedUsers.set(socket.userId, socket.id);

    // Join chat room
    socket.on('join-room', async ({ chatRoomId }) => {
      try {
        // Verify user has access to this room
        const match = await Match.findOne({ chatRoomId });
        
        if (!match) {
          socket.emit('error', { message: 'Chat room not found' });
          return;
        }

        const isAuthorized = 
          match.lostUser.toString() === socket.userId || 
          match.foundUser.toString() === socket.userId;

        if (!isAuthorized) {
          socket.emit('error', { message: 'Not authorized' });
          return;
        }

        socket.join(chatRoomId);
        socket.currentRoom = chatRoomId;
        socket.emit('joined-room', { chatRoomId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Send message
    socket.on('send-message', async ({ chatRoomId, content }) => {
      try {
        if (socket.currentRoom !== chatRoomId) {
          socket.emit('error', { message: 'Not in this room' });
          return;
        }

        const message = await Message.create({
          chatRoomId,
          sender: socket.userId,
          content,
          type: 'text'
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name');

        io.to(chatRoomId).emit('new-message', populatedMessage);

        // Create notification for the other user
        try {
          const match = await Match.findOne({ chatRoomId });
          if (match) {
            const recipientId = match.lostUser.toString() === socket.userId 
              ? match.foundUser 
              : match.lostUser;

            // Always create notification for new messages (without showing message content)
            await Notification.create({
              user: recipientId,
              type: 'message',
              title: '💬 New Message',
              message: `You have a new message from ${socket.userName}. Click to view the chat.`,
              link: `/chat/${chatRoomId}`,
              data: { chatRoomId, messageId: message._id }
            });
            
            console.log(`✅ Created message notification for user ${recipientId}`);
          }
        } catch (notifError) {
          console.error('Notification creation error:', notifError);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ chatRoomId }) => {
      socket.to(chatRoomId).emit('user-typing', {
        userId: socket.userId,
        userName: socket.userName
      });
    });

    socket.on('stop-typing', ({ chatRoomId }) => {
      socket.to(chatRoomId).emit('user-stop-typing', {
        userId: socket.userId
      });
    });

    // Mark messages as read
    socket.on('mark-read', async ({ chatRoomId }) => {
      try {
        await Message.updateMany(
          { chatRoomId, sender: { $ne: socket.userId } },
          { $addToSet: { readBy: socket.userId } }
        );

        socket.to(chatRoomId).emit('messages-read', {
          userId: socket.userId
        });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
    });
  });
};

exports.getIO = () => io;
