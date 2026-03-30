// routes/workshopRoutes.js

const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const {
  getAllWorkshops, getWorkshopById, getMyWorkshops,
  createWorkshop, updateWorkshop, deleteWorkshop,
  enrollInWorkshop, unenrollFromWorkshop,
} = require('../controllers/workshopController');
const { protect, adminOnly } = require('../middleware/auth');

const workshopRules = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('date').isISO8601().withMessage('A valid date is required.'),
];

// Public
router.get('/', getAllWorkshops);

// FIX: /my must come BEFORE /:id — otherwise Express matches "my" as an id
router.get('/my', protect, getMyWorkshops);

// Single workshop by id
router.get('/:id', getWorkshopById);

// FIX: Admin routes were completely missing — workshops could never be created/edited/deleted
router.post('/',     protect, adminOnly, workshopRules, createWorkshop);
router.put('/:id',   protect, adminOnly, updateWorkshop);
router.delete('/:id',protect, adminOnly, deleteWorkshop);

// Enroll / unenroll (authenticated users)
router.post('/:id/enroll',   protect, enrollInWorkshop);
router.delete('/:id/enroll', protect, unenrollFromWorkshop);

module.exports = router;
