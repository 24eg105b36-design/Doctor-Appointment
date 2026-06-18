import React, { useState, useEffect } from 'react';
import { getMyAppointments, updateStatus } from '../services/appointmentService';
import { toast } from 'react-toastify';
import { Clock, Calendar, XCircle, CheckCircle, FileText } from 'lucide-react';

const getProfileImg = (img) => {
    if (!img || img === 'default-profile.png') return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
};

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await getMyAppointments();
            setAppointments(res.data);
        } catch (err) {
            toast.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await updateStatus(id, 'Cancelled');
            toast.success('Appointment cancelled');
            fetchAppointments();
        } catch (err) {
            toast.error('Failed to cancel appointment');
        }
    };

    return (
        <div className="container py-5">
            <div className="d-flex align-items-center justify-content-between mb-5">
                <h2 className="fw-bold mb-0">My Appointments</h2>
                <div className="badge bg-light-primary text-primary px-3 py-2 rounded-pill border">
                    {appointments.length} Total Bookings
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                    <Calendar size={64} className="text-light-subtle mb-3" />
                    <h5 className="text-muted">No appointments found</h5>
                    <p className="text-muted small">Start by searching for a doctor</p>
                </div>
            ) : (
                <div className="row g-4">
                    {appointments.map(appt => (
                        <div className="col-md-6 col-lg-4" key={appt._id}>
                            <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                                <div className={`card-header border-0 py-2 small fw-bold d-flex align-items-center justify-content-between ${
                                    appt.status === 'Confirmed' ? 'bg-light-success text-success' : 
                                    appt.status === 'Cancelled' ? 'bg-light-danger text-danger' : 
                                    'bg-light-warning text-warning'
                                }`}>
                                    <span>#{appt._id.slice(-6).toUpperCase()}</span>
                                    <span>{appt.status}</span>
                                </div>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-4">
                                        <img src={getProfileImg(appt.doctorId?.userId?.profileImage)} className="rounded-circle me-3 border" style={{width: '50px', height: '50px', objectFit: 'cover'}} alt="Doc" />
                                        <div>
                                            <h6 className="mb-0 fw-bold">{appt.doctorId?.userId?.name}</h6>
                                            <span className="text-muted small">{appt.doctorId?.specialization || 'General'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center text-muted small mb-1">
                                            <Calendar size={14} className="me-2" /> 
                                            {new Date(appt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="d-flex align-items-center text-muted small">
                                            <Clock size={14} className="me-2" /> {appt.appointmentTime}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        {appt.status === 'Pending' && (
                                            <button onClick={() => handleCancel(appt._id)} className="btn btn-outline-danger btn-sm border-0 bg-light flex-fill fw-bold rounded-pill">
                                                <XCircle size={14} className="me-1" /> Cancel
                                            </button>
                                        )}
                                        {appt.status === 'Completed' && (
                                            <button className="btn btn-outline-primary btn-sm border-0 bg-light flex-fill fw-bold rounded-pill">
                                                <FileText size={14} className="me-1" /> View Prescription
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
