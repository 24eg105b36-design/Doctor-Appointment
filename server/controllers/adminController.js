const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get all doctors (including unapproved)
// @route   GET /api/admin/doctors
// @access  Private/Admin
exports.getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find().populate('userId', 'name email role isVerified');
        res.status(200).json({ success: true, data: doctors });
    } catch (err) {
        next(err);
    }
};

// @desc    Approve or Reject doctor
// @route   PATCH /api/admin/doctors/:id/approve
// @access  Private/Admin
exports.verifyDoctor = async (req, res, next) => {
    try {
        const { isApproved } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
        
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.status(200).json({ success: true, data: doctor });
    } catch (err) {
        next(err);
    }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
    try {
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalAppointments = await Appointment.countDocuments();
        
        // Simple revenue calculation (sum of confirmed appointment fees)
        const appointments = await Appointment.find({ status: 'Completed' }).populate('doctorId', 'consultationFee');
        const revenue = appointments.reduce((acc, curr) => acc + (curr.doctorId ? curr.doctorId.consultationFee : 0), 0);

        res.status(200).json({
            success: true,
            data: {
                totalPatients,
                totalDoctors,
                totalAppointments,
                totalRevenue: revenue
            }
        });
    } catch (err) {
        next(err);
    }
};
