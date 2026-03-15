// routes/talentRoutes.js

const express  = require('express');
const router   = express.Router();
const { body } = require('express-validator');
const {
  getAllTalents, getTalentById,
  createTalent, updateTalent, deleteTalent,
} = require('../controllers/talentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const talentRules = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
];

// Public
router.get('/',    getAllTalents);
router.get('/:id', getTalentById);

// Protected
router.post('/',    protect, upload.single('file'), talentRules, createTalent);
router.put('/:id',  protect, updateTalent);
router.delete('/:id', protect, deleteTalent);

module.exports = router;