const Doctor = require('../models/Doctor');
const User = require('../models/User');

exports.getAllDoctors = async (query) => {
    const { 
        specialization, 
        experience, 
        minFee, 
        maxFee, 
        rating, 
        search,
        sort,
        page = 1,
        limit = 10 
    } = query;

    const filter = { isApproved: true };

    // Filtering
    if (specialization) filter.specialization = specialization;
    if (experience) filter.experience = { $gte: Number(experience) };
    if (minFee || maxFee) {
        filter.consultationFee = {};
        if (minFee) filter.consultationFee.$gte = Number(minFee);
        if (maxFee) filter.consultationFee.$lte = Number(maxFee);
    }
    if (rating) filter.rating = { $gte: Number(rating) };

    // Search by name (requires join or separate user search)
    // For simplicity, we search doctors and populate user
    let doctors = Doctor.find(filter).populate('userId', 'name profileImage address');

    // Sorting
    if (sort) {
        const sortBy = sort.split(',').join(' ');
        doctors = doctors.sort(sortBy);
    } else {
        doctors = doctors.sort('-createdAt');
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    doctors = doctors.skip(skip).limit(Number(limit));

    const results = await doctors;
    const total = await Doctor.countDocuments(filter);

    return {
        doctors: results,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
    };
};

exports.getDoctorById = async (id) => {
    return await Doctor.findById(id).populate('userId', 'name email phone profileImage address gender');
};
