require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./src/models/Item');
const Match = require('./src/models/Match');
const { v4: uuidv4 } = require('uuid');
const { sendMatchNotifications } = require('./src/services/notificationService');

const createVivoMatch = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the vivo items
    const foundVivo = await Item.findOne({ 
      title: /vivo.*phn/i,
      type: 'found'
    });
    
    const lostVivo = await Item.findOne({ 
      title: /vivo.*phone/i,
      type: 'lost'
    });

    if (!foundVivo || !lostVivo) {
      console.log('❌ Could not find both vivo items');
      console.log('Found:', foundVivo ? foundVivo.title : 'NOT FOUND');
      console.log('Lost:', lostVivo ? lostVivo.title : 'NOT FOUND');
      process.exit(1);
    }

    console.log(`✅ Found items:`);
    console.log(`   Found: "${foundVivo.title}" by ${foundVivo.user}`);
    console.log(`   Lost: "${lostVivo.title}" by ${lostVivo.user}\n`);

    // Check if match already exists
    const existingMatch = await Match.findOne({
      lostItem: lostVivo._id,
      foundItem: foundVivo._id
    });

    if (existingMatch) {
      console.log('⚠️  Match already exists!');
      console.log(`   Match ID: ${existingMatch._id}`);
      console.log(`   Score: ${(existingMatch.matchScore * 100).toFixed(0)}%`);
      process.exit(0);
    }

    // Create the match
    const chatRoomId = uuidv4();
    const match = await Match.create({
      lostItem: lostVivo._id,
      foundItem: foundVivo._id,
      lostUser: lostVivo.user,
      foundUser: foundVivo.user,
      matchScore: 0.12, // 12% similarity
      matchType: 'text',
      chatRoomId,
      status: 'pending'
    });

    console.log('✅ Match created successfully!');
    console.log(`   Match ID: ${match._id}`);
    console.log(`   Score: ${(match.matchScore * 100).toFixed(0)}%`);
    console.log(`   Chat Room: ${chatRoomId}\n`);

    // Send notifications
    console.log('📧 Sending notifications...');
    await sendMatchNotifications(match);
    console.log('✅ Notifications sent!\n');

    // Update item statuses
    await Item.findByIdAndUpdate(lostVivo._id, { status: 'matched' });
    await Item.findByIdAndUpdate(foundVivo._id, { status: 'matched' });
    console.log('✅ Item statuses updated to "matched"\n');

    console.log('🎉 Done! The vivo phone match has been created.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createVivoMatch();
