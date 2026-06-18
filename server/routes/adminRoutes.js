const express = require('express');
const { getAllDoctors, verifyDoctor, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/doctors', getAllDoctors);
router.patch('/doctors/:id/approve', verifyDoctor);
router.get('/stats', getStats);

module.exports = router;
