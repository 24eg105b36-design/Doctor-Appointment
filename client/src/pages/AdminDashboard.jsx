import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Users, UserCheck, Calendar, TrendingUp, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalPatients: 0, totalDoctors: 0, totalRevenue: 0, totalAppointments: 0 });
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, doctorsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/doctors')
            ]);
            setStats(statsRes.data.data);
            setDoctors(doctorsRes.data.data);
        } catch (err) {
            toast.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, isApproved) => {
        try {
            await api.patch(`/admin/doctors/${id}/approve`, { isApproved });
            toast.success(isApproved ? 'Doctor approved' : 'Doctor rejected');
            fetchData();
        } catch (err) {
            toast.error('Verification update failed');
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-5">Admin Overview</h2>
            
            <div className="row g-4 mb-5">
                {[
                    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'primary' },
                    { label: 'Total Doctors', value: stats.totalDoctors, icon: UserCheck, color: 'success' },
                    { label: 'Appointments', value: stats.totalAppointments, icon: Calendar, color: 'info' },
                    { label: 'Revenue', value: `$${stats.totalRevenue}`, icon: TrendingUp, color: 'warning' }
                ].map((item, idx) => (
                    <div className="col-md-3" key={idx}>
                        <div className={`card border-0 shadow-sm p-4 rounded-4 bg-white border-start border-4 border-${item.color}`}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted small fw-bold mb-1">{item.label}</h6>
                                    <h3 className="fw-bold mb-0">{item.value}</h3>
                                </div>
                                <item.icon size={28} className={`text-${item.color} opacity-75`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                <div className="card-header bg-white py-3 border-light d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Doctor Verification Queue</h5>
                    <span className="badge bg-light-warning text-warning border-0">Pending Review</span>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="small text-muted text-uppercase">
                                <th className="ps-4">Doctor Details</th>
                                <th>Specialization</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc._id}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <div className="p-2 bg-light rounded-3 me-3 text-primary fw-bold">
                                                {doc.userId?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="fw-bold small">{doc.userId?.name}</div>
                                                <div className="text-muted" style={{fontSize: '11px'}}>{doc.userId?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="small">{doc.specialization}</td>
                                    <td>
                                        <span className={`badge border-0 px-3 py-1 rounded-pill ${doc.isApproved ? 'bg-light-success text-success' : 'bg-light-warning text-warning'}`}>
                                            {doc.isApproved ? 'Approved' : 'Pending Approval'}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        {!doc.isApproved ? (
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button onClick={() => handleVerify(doc._id, true)} className="btn btn-success btn-sm rounded-pill px-4 fw-bold shadow-sm">
                                                    Approve
                                                </button>
                                                <button onClick={() => handleVerify(doc._id, false)} className="btn btn-outline-danger btn-sm rounded-pill px-3 border-light">
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleVerify(doc._id, false)} className="btn btn-outline-secondary btn-sm border-0 rounded-pill px-3 bg-light">
                                                <ShieldAlert size={14} className="me-1" /> Suspend
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {doctors.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">No doctor records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
