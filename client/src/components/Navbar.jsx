import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import { Stethoscope, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg border-bottom py-3 sticky-top bg-white">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center fw-bold text-primary" to="/">
                    <Stethoscope className="me-2" size={28} />
                    Book-a-Doctor
                </Link>
                
                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/doctors">Find Doctors</Link></li>
                    </ul>

                    <div className="d-flex align-items-center">
                        {user ? (
                            <div className="dropdown">
                                <button className="btn btn-primary d-flex align-items-center dropdown-toggle px-3 rounded-pill" type="button" data-bs-toggle="dropdown">
                                    <User size={18} className="me-2" />
                                    {user.name}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm mt-2">
                                    <li><Link className="dropdown-item py-2" to={`/${user.role}/dashboard`}>
                                        <LayoutDashboard size={16} className="me-2" />
                                        Dashboard
                                    </Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item py-2 text-danger" onClick={onLogout}>
                                        <LogOut size={16} className="me-2" />
                                        Logout
                                    </button></li>
                                </ul>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-outline-primary px-4 rounded-pill">Login</Link>
                                <Link to="/register" className="btn btn-primary px-4 rounded-pill">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
