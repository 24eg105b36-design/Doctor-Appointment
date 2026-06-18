import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { User, MapPin, DollarSign, Award, Save, Clock } from 'lucide-react';

const DoctorProfile = () => {
    const [formData, setFormData] = useState({
        specialization: '',
        experience: '',
        consultationFee: '',
        clinicAddress: '',
        availability: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/doctors/profile');
                if (res.data.success && res.data.data) {
                    setFormData(res.data.data);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/doctors/profile', formData);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h4 className="fw-bold mb-4 d-flex align-items-center">
                            <User className="text-primary me-2" /> Manage Medical Profile
                        </h4>
                        <form onSubmit={onSubmit}>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Specialization</label>
                                    <div className="input-group border rounded-3 p-1">
                                        <span className="input-group-text bg-white border-0"><Award size={18} className="text-primary" /></span>
                                        <input type="text" className="form-control border-0 shadow-none" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Cardiologist" required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Experience (Years)</label>
                                    <div className="input-group border rounded-3 p-1">
                                        <span className="input-group-text bg-white border-0"><Clock size={18} className="text-primary" /></span>
                                        <input type="number" className="form-control border-0 shadow-none" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} placeholder="e.g. 5" required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Consultation Fee ($)</label>
                                    <div className="input-group border rounded-3 p-1">
                                        <span className="input-group-text bg-white border-0"><DollarSign size={18} className="text-primary" /></span>
                                        <input type="number" className="form-control border-0 shadow-none" value={formData.consultationFee} onChange={(e) => setFormData({...formData, consultationFee: e.target.value})} placeholder="e.g. 50" required />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label small fw-bold text-muted">Clinic Address</label>
                                    <div className="input-group border rounded-3 p-1">
                                        <span className="input-group-text bg-white border-0"><MapPin size={18} className="text-primary" /></span>
                                        <input type="text" className="form-control border-0 shadow-none" value={formData.clinicAddress} onChange={(e) => setFormData({...formData, clinicAddress: e.target.value})} placeholder="Enter clinic street address..." required />
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center">
                                <Save size={18} className="me-2" /> Save Profile Details
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
