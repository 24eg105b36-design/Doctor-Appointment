import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../redux/authSlice';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess || user) {
            navigate(`/${user.role}/dashboard`);
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card border-0 shadow-lg p-4">
                        <div className="text-center mb-4">
                            <div className="bg-light-primary rounded-circle d-inline-flex p-3 mb-3">
                                <LogIn className="text-primary" size={32} />
                            </div>
                            <h2 className="fw-bold">Welcome Back</h2>
                            <p className="text-muted">Login to manage your appointments</p>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email Address</label>
                                <div className="input-group border rounded-3 p-1">
                                    <span className="input-group-text bg-white border-0"><Mail size={18} className="text-muted" /></span>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={email} 
                                        onChange={onChange} 
                                        className="form-control border-0 shadow-none" 
                                        placeholder="name@example.com" 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Password</label>
                                <div className="input-group border rounded-3 p-1">
                                    <span className="input-group-text bg-white border-0"><Lock size={18} className="text-muted" /></span>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={password} 
                                        onChange={onChange} 
                                        className="form-control border-0 shadow-none" 
                                        placeholder="••••••••" 
                                        required 
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="btn btn-primary w-100 py-3 rounded-3 fw-bold mb-3 shadow-sm">
                                {isLoading ? 'Logging in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="text-center mt-3 small text-muted">
                            Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-bold">Register here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
