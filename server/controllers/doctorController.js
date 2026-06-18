const doctorService = require('../services/doctorService');
const Doctor = require('../models/Doctor');

// @desc    Get all doctors (with filters & pagination)
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
    try {
        const result = await doctorService.getAllDoctors(req.query);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current doctor's profile
// @route   GET /api/doctors/profile
// @access  Private/Doctor
exports.getMyProfile = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id }).populate('userId', 'name email phone profileImage address gender');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update doctor profile (Doctor only)
// @route   PUT /api/doctors/profile
// @access  Private/Doctor
exports.updateProfile = async (req, res, next) => {
    try {
        let doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }

        doctor = await Doctor.findOneAndUpdate(
            { userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (err) {
        next(err);
    }
};
