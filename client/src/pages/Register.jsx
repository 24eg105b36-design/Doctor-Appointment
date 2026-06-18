import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { UserPlus, User, Award, Mail, Phone, Lock } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'patient'
    });
    const { name, email, password, phone, role } = formData;
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/register', formData);
            if (res.data.success) {
                toast.success('Registration successful! Please login.');
                navigate('/login');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0 shadow-lg p-4">
                        <div className="text-center mb-4">
                            <div className="bg-light-primary rounded-circle d-inline-flex p-3 mb-3">
                                <UserPlus className="text-primary" size={32} />
                            </div>
                            <h2 className="fw-bold">Create Account</h2>
                            <p className="text-muted">Join the Book-a-Doctor community</p>
                        </div>

                        <div className="role-selector d-flex gap-3 mb-4 justify-content-center">
                            <button 
                                onClick={() => setFormData({...formData, role: 'patient'})}
                                className={`btn flex-fill py-3 rounded-4 border-2 d-flex flex-column align-items-center ${role === 'patient' ? 'btn-primary border-primary' : 'btn-outline-secondary border-light-subtle bg-light'}`}
                            >
                                <User size={24} className="mb-2" />
                                <span className="small fw-bold">Patient</span>
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, role: 'doctor'})}
                                className={`btn flex-fill py-3 rounded-4 border-2 d-flex flex-column align-items-center ${role === 'doctor' ? 'btn-primary border-primary' : 'btn-outline-secondary border-light-subtle bg-light'}`}
                            >
                                <Award size={24} className="mb-2" />
                                <span className="small fw-bold">Doctor</span>
                            </button>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Full Name</label>
                                    <div className="input-group border rounded-3 p-1">
                                        <span className="input-group-text bg-white border-0"><User size={18} className="text-muted" /></span>
                                        <input type="text" name="name" value={name} onChange={onChange} className="form-control border-0 shadow-none" placeholder="John Doe" required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Phone Number</label>
                                    <div className="input-group border rounded-3 p-1">
                                        <span className="input-group-text bg-white border-0"><Phone size={18} className="text-muted" /></span>
                                        <input type="text" name="phone" value={phone} onChange={onChange} className="form-control border-0 shadow-none" placeholder="+1..." required />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email Address</label>
                                <div className="input-group border rounded-3 p-1">
                                    <span className="input-group-text bg-white border-0"><Mail size={18} className="text-muted" /></span>
                                    <input type="email" name="email" value={email} onChange={onChange} className="form-control border-0 shadow-none" placeholder="name@example.com" required />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Password</label>
                                <div className="input-group border rounded-3 p-1">
                                    <span className="input-group-text bg-white border-0"><Lock size={18} className="text-muted" /></span>
                                    <input type="password" name="password" value={password} onChange={onChange} className="form-control border-0 shadow-none" placeholder="••••••••" required />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary w-100 py-3 rounded-3 fw-bold mb-3 shadow-sm">
                                {loading ? 'Registering...' : 'Complete Registration'}
                            </button>
                        </form>

                        <div className="text-center mt-3 small text-muted">
                            Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Login here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
