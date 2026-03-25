const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Item = require('./src/models/Item');
  const Match = require('./src/models/Match');
  const { findMatches } = require('./src/services/matchingService');

  // Delete all existing matches with null items
  const matches = await Match.find({});
  for (const m of matches) {
    const lost = await Item.findById(m.lostItem);
    const found = await Item.findById(m.foundItem);
    if (!lost || !found) {
      console.log('Deleting broken match:', m._id);
      await Match.findByIdAndDelete(m._id);
    } else {
      console.log('Valid match:', lost.title, '<->', found.title);
    }
  }

  // Reset all items to active
  await Item.updateMany({}, { status: 'active', matchedWith: null, matchScore: null });
  console.log('Reset all items to active');

  // Trigger fresh matching
  const items = await Item.find({ status: 'active' }).populate('user');
  console.log('Triggering matching for', items.length, 'items');
  for (const item of items) {
    try {
      await findMatches(item);
    } catch (err) {
      console.error('Match error for', item.title, ':', err.message);
    }
  }

  console.log('Done!');
  mongoose.disconnect();
}).catch(err => {
  console.error(err.message);
  process.exit(1);
});
