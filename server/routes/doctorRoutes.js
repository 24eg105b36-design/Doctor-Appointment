const express = require('express');
const { getDoctors, getDoctor, getMyProfile, updateProfile } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDoctors);
router.get('/profile', protect, authorize('doctor'), getMyProfile);
router.get('/:id', getDoctor);
router.put('/profile', protect, authorize('doctor'), updateProfile);

module.exports = router;
