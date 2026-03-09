const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getMyItems,
  getItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const { itemValidation, validate } = require('../middleware/validation');
const upload = require('../middleware/upload');

router.post(
  '/',
  protect,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
  createItem
);

router.get('/', protect, getItems);
router.get('/my-items', protect, getMyItems);
router.get('/:id', protect, getItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
