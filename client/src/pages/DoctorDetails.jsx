import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById } from '../services/doctorService';
import { bookAppointment } from '../services/appointmentService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Calendar, Clock, MapPin, Award, CheckCircle } from 'lucide-react';

const getProfileImg = (img) => {
    if (!img || img === 'default-profile.png') return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
};

const DoctorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await getDoctorById(id);
                setDoctor(res.data);
            } catch (err) {
                toast.error('Failed to fetch doctor details');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            toast.warning('Please login to book an appointment');
            return navigate('/login');
        }
        if (!selectedDate || !selectedTime) {
            return toast.error('Please select both date and time');
        }

        try {
            await bookAppointment({
                doctorId: doctor._id,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime
            });
            toast.success('Appointment booked successfully!');
            navigate('/patient/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Booking failed');
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
    if (!doctor) return <div className="text-center py-5">Doctor not found</div>;

    return (
        <div className="container py-5">
            <div className="row g-5">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm overflow-hidden mb-4 rounded-4">
                        <div className="bg-primary p-4 text-white d-flex align-items-center">
                            <img src={getProfileImg(doctor.userId?.profileImage)} className="rounded-circle me-4 border border-4 border-white shadow" style={{width: '120px', height: '120px', objectFit: 'cover'}} alt="Dr" />
                            <div>
                                <h1 className="h3 fw-bold mb-1">{doctor.userId?.name}</h1>
                                <p className="mb-0 opacity-75 d-flex align-items-center">
                                    <Award size={18} className="me-2" /> {doctor.specialization}
                                </p>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">About Doctor</h5>
                            <p className="text-muted mb-4">
                                {doctor.userId?.name} is a highly experienced {doctor.specialization} with {doctor.experience} years of clinical practice. 
                                Known for excellence in patient care and evidence-based treatments.
                            </p>
                            
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="border rounded-3 p-3 bg-light">
                                        <div className="small fw-bold text-primary mb-1">Clinic Address</div>
                                        <div className="d-flex small">
                                            <MapPin size={16} className="me-2 flex-shrink-0" />
                                            {doctor.clinicAddress}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="border rounded-3 p-3 bg-light">
                                        <div className="small fw-bold text-primary mb-1">Consultation Fee</div>
                                        <div className="h5 fw-bold mb-0">${doctor.consultationFee}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center">
                            <Calendar size={20} className="me-2 text-primary" /> Select Appointment Slot
                        </h5>
                        
                        <div className="mb-4">
                            <label className="form-label small fw-bold mb-3">1. Select Date</label>
                            <input 
                                type="date" 
                                className="form-control form-control-lg border-light-subtle rounded-3" 
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        {selectedDate && (
                            <div>
                                <label className="form-label small fw-bold mb-3">2. Select Time</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {doctor.availability.find(a => a.day === (() => { const [y, m, d] = selectedDate.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }); })())?.slots.map(slot => (
                                        <button 
                                            key={slot}
                                            onClick={() => setSelectedTime(slot)}
                                            className={`btn rounded-3 px-4 py-2 small fw-bold ${selectedTime === slot ? 'btn-primary' : 'btn-outline-light text-dark border-light-subtle bg-white'}`}
                                        >
                                            <Clock size={14} className="me-2" /> {slot}
                                        </button>
                                    )) || <div className="text-muted small p-2 bg-light w-100 rounded">No slots available on this day.</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 sticky-top rounded-4" style={{top: '100px'}}>
                        <h5 className="fw-bold mb-4">Booking Summary</h5>
                        <div className="small mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Physician</span>
                                <span className="fw-bold">{doctor.userId?.name}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Date</span>
                                <span className="fw-bold text-primary">{selectedDate || 'Not selected'}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Time</span>
                                <span className="fw-bold text-primary">{selectedTime || 'Not selected'}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between h5 mb-0">
                                <span className="fw-bold text-dark">Total Fee</span>
                                <span className="fw-bold text-primary">${doctor.consultationFee}</span>
                            </div>
                        </div>
                        <button 
                            className="btn btn-primary w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                            onClick={handleBooking}
                        >
                            <CheckCircle size={18} className="me-2" /> Confirm Booking
                        </button>
                        <p className="text-center small text-muted mt-3 mb-0">Secure checkout powered by Stripe</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
