const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { generateToken, generateRefreshToken } = require('../utils/tokens');

exports.registerUser = async (userData) => {
    const { name, email, password, phone, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('User already exists');
        error.status = 400;
        throw error;
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone,
        role
    });

    // If role is doctor, create doctor profile (pending approval)
    if (role === 'doctor') {
        await Doctor.create({
            userId: user._id,
            specialization: 'General', // Default, to be updated by doctor
            experience: 0,
            consultationFee: 0,
            clinicAddress: 'Update required',
            availability: [
                { day: 'Monday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'] },
                { day: 'Tuesday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'] },
                { day: 'Wednesday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'] },
                { day: 'Thursday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'] },
                { day: 'Friday', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'] }
            ]
        });
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    };
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id)
    };
};
