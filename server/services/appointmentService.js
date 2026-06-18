const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.bookAppointment = async (appointmentData) => {
    const { doctorId, appointmentDate, appointmentTime } = appointmentData;

    // 1. Check if doctor exists and is approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isApproved) {
        const error = new Error('Doctor not found or not approved');
        error.status = 404;
        throw error;
    }

    // 2. Check if the slot exists in doctor's availability
    let dayName;
    if (typeof appointmentDate === 'string' && appointmentDate.includes('-')) {
        const [year, month, day] = appointmentDate.split('T')[0].split('-').map(Number);
        const dateObj = new Date(Date.UTC(year, month - 1, day));
        dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    } else {
        dayName = new Date(appointmentDate).toLocaleString('en-us', { weekday: 'long' });
    }
    const dayAvailability = doctor.availability.find(a => a.day === dayName);
    
    if (!dayAvailability || !dayAvailability.slots.includes(appointmentTime)) {
        const error = new Error('Selected time slot is not available for this doctor');
        error.status = 400;
        throw error;
    }

    // 3. Check for conflicts (already booked)
    const existingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate,
        appointmentTime,
        status: { $ne: 'Cancelled' }
    });

    if (existingAppointment) {
        const error = new Error('This slot is already booked');
        error.status = 409;
        throw error;
    }

    // 4. Create appointment
    return await Appointment.create(appointmentData);
};

exports.updateAppointmentStatus = async (id, status, userId, role) => {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
        const error = new Error('Appointment not found');
        error.status = 404;
        throw error;
    }

    // Authorization check
    if (role === 'patient' && appointment.patientId.toString() !== userId.toString()) {
        const error = new Error('Not authorized');
        error.status = 403;
        throw error;
    }

    appointment.status = status;
    await appointment.save();
    return appointment;
};
