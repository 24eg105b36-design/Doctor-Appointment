const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: [true, 'Please add a specialization']
    },
    qualifications: [{
        type: String
    }],
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    consultationFee: {
        type: Number,
        required: [true, 'Please add consultation fee']
    },
    clinicAddress: {
        type: String,
        required: [true, 'Please add clinic address']
    },
    availability: [{
        day: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        slots: [{
            type: String // Format: "09:00", "09:30"
        }]
    }],
    documents: [{
        name: String,
        url: String
    }],
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
