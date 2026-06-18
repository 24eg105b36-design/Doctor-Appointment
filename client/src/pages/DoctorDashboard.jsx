import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Users, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

const getProfileImg = (img) => {
    if (!img || img === 'default-profile.png') return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
};

const DoctorDashboard = () => {
    const [stats, setStats] = useState({ appointments: [], totalPatients: 0, earnings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/appointments');
            const appts = res.data.data;
            const completed = appts.filter(a => a.status === 'Completed');
            const earnings = completed.length * 50; // Mock fee or sum from actual data
            
            setStats({
                appointments: appts,
                totalPatients: new Set(appts.map(a => a.patientId._id)).size,
                earnings
            });
        } catch (err) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            toast.success(`Appointment ${status}`);
            fetchData();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container py-5">
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="opacity-75 small fw-bold">Total Patients</h6>
                                <h2 className="fw-bold mb-0">{stats.totalPatients}</h2>
                            </div>
                            <Users size={32} className="opacity-50" />
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-success text-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="opacity-75 small fw-bold">Monthly Earnings</h6>
                                <h2 className="fw-bold mb-0">${stats.earnings}</h2>
                            </div>
                            <DollarSign size={32} className="opacity-50" />
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-info text-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="opacity-75 small fw-bold">Upcoming</h6>
                                <h2 className="fw-bold mb-0">{stats.appointments.filter(a => a.status === 'Confirmed').length}</h2>
                            </div>
                            <Calendar size={32} className="opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 border-light">
                    <h5 className="fw-bold mb-0">Recent Appointment Requests</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="small text-muted text-uppercase">
                                <th className="ps-4">Patient</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.appointments.map(appt => (
                                <tr key={appt._id}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <img src={getProfileImg(appt.patientId?.profileImage)} className="rounded-circle me-3" style={{width: '40px', height: '40px', objectFit: 'cover'}} alt="P" />
                                            <div>
                                                <div className="fw-bold small">{appt.patientId?.name}</div>
                                                <div className="text-muted" style={{fontSize: '11px'}}>{appt.patientId?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="small text-muted">
                                        <div>{new Date(appt.appointmentDate).toLocaleDateString()}</div>
                                        <div className="fw-bold text-dark">{appt.appointmentTime}</div>
                                    </td>
                                    <td>
                                        <span className={`badge border-0 px-3 py-1 rounded-pill ${
                                            appt.status === 'Confirmed' ? 'bg-light-success text-success' : 
                                            appt.status === 'Rejected' ? 'bg-light-danger text-danger' : 
                                            'bg-light-warning text-warning'
                                        }`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        {appt.status === 'Pending' && (
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button onClick={() => handleStatusUpdate(appt._id, 'Confirmed')} className="btn btn-success btn-sm rounded-pill px-3">
                                                    Accept
                                                </button>
                                                <button onClick={() => handleStatusUpdate(appt._id, 'Rejected')} className="btn btn-outline-danger btn-sm rounded-pill px-3 border-light">
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {appt.status === 'Confirmed' && (
                                            <button onClick={() => handleStatusUpdate(appt._id, 'Completed')} className="btn btn-primary btn-sm rounded-pill px-3">
                                                Mark Completed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {stats.appointments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">No appointments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
