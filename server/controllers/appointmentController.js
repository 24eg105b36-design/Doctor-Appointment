const appointmentService = require('../services/appointmentService');
const Appointment = require('../models/Appointment');

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private/Patient
exports.bookAppointment = async (req, res, next) => {
    try {
        req.body.patientId = req.user._id;
        const appointment = await appointmentService.bookAppointment(req.body);
        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's appointments (Patient or Doctor)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'patient') {
            query = { patientId: req.user._id };
        } else if (req.user.role === 'doctor') {
            // Need doctor document ID first
            const Doctor = require('../models/Doctor');
            const doctor = await Doctor.findOne({ userId: req.user._id });
            query = { doctorId: doctor._id };
        } else {
            query = {}; // Admin sees all (maybe restrict)
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email phone profileImage')
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name profileImage' }
            })
            .sort('-appointmentDate');

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const appointment = await appointmentService.updateAppointmentStatus(
            req.params.id,
            status,
            req.user._id,
            req.user.role
        );
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};
