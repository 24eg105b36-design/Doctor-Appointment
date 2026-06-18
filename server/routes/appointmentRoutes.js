const express = require('express');
const { bookAppointment, getAppointments, updateStatus } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('patient'), bookAppointment);
router.get('/', getAppointments);
router.patch('/:id/status', updateStatus);

module.exports = router;
