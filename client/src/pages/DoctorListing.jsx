import React, { useState, useEffect } from 'react';
import { getDoctors } from '../services/doctorService';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react';

const getProfileImg = (img) => {
    if (!img || img === 'default-profile.png') return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
};

const DoctorListing = () => {
    const [doctors, setDoctors] = useState([]);
    const [filters, setFilters] = useState({
        specialization: '',
        search: '',
        sort: '-rating'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const data = await getDoctors(filters);
                setDoctors(data.doctors);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [filters]);

    return (
        <div className="container py-5">
            <div className="row g-4">
                <div className="col-lg-3">
                    <div className="card border-0 shadow-sm p-4 sticky-top" style={{top: '100px'}}>
                        <h5 className="fw-bold mb-4 d-flex align-items-center">
                            <Filter size={18} className="me-2 text-primary" /> Filters
                        </h5>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Specialization</label>
                            <select 
                                className="form-select border-light-subtle rounded-3" 
                                onChange={(e) => setFilters({...filters, specialization: e.target.value})}
                            >
                                <option value="">All Specialties</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Neurologist">Neurologist</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Sort By</label>
                            <select 
                                className="form-select border-light-subtle rounded-3"
                                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                            >
                                <option value="-rating">Highest Rated</option>
                                <option value="consultationFee">Lowest Fee</option>
                                <option value="-experience">Most Experienced</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-lg-9">
                    <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden bg-white border">
                        <span className="input-group-text bg-white border-0 ps-4">
                            <Search size={20} className="text-muted" />
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 py-3 shadow-none" 
                            placeholder="Search by specialty or doctor name..." 
                            onKeyDown={(e) => e.key === 'Enter' && setFilters({...filters, search: e.target.value})}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {doctors.map(doctor => (
                                <div className="col-md-6" key={doctor._id}>
                                    <div className="card h-100 border-0 shadow-sm hover-lift">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <img src={getProfileImg(doctor.userId?.profileImage)} className="rounded-circle me-3 border" style={{width: '60px', height: '60px', objectFit: 'cover'}} alt="Dr" />
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{doctor.userId?.name}</h6>
                                                    <span className="badge bg-light-primary text-primary border-0 small px-2 py-1">
                                                        {doctor.specialization}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="small text-muted mb-3">
                                                <div className="d-flex align-items-center mb-1">
                                                    <Star size={14} className="text-warning fill-warning me-1" />
                                                    {doctor.rating} ({doctor.totalReviews} reviews)
                                                </div>
                                                <div className="d-flex align-items-center mb-1">
                                                    <Clock size={14} className="me-1" /> {doctor.experience} Years Experience
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <MapPin size={14} className="me-1" /> {doctor.clinicAddress}
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                                                <span className="fw-bold text-primary">${doctor.consultationFee}</span>
                                                <Link to={`/doctors/${doctor._id}`} className="btn btn-outline-primary rounded-pill px-4 btn-sm fw-bold">
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorListing;
