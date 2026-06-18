const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Please add appointment date']
    },
    appointmentTime: {
        type: String,
        required: [true, 'Please add appointment time']
    },
    symptoms: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    prescription: {
        notes: String,
        medicines: [{
            name: String,
            dosage: String,
            duration: String
        }],
        fileUrl: String
    },
    uploadedReports: [{
        name: String,
        url: String
    }]
}, {
    timestamps: true
});

// Avoid duplicate appointments for the same doctor at the same time
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, appointmentTime: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
