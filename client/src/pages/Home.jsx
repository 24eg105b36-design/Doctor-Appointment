import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ShieldCheck } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4">Your Health, <span className="text-primary">Our Priority.</span></h1>
                            <p className="lead mb-5 text-secondary">
                                Connect with top-rated doctors, book appointments instantly, and manage your healthcare journey all in one place.
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/doctors" className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm">
                                    Book Appointment Now
                                </Link>
                                <Link to="/about" className="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-block text-center">
                            <img src="https://cdni.iconscout.com/illustration/premium/thumb/online-doctor-appointment-2815777-2342595.png" alt="Hero" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="features py-5">
                <div className="container px-4">
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white shadow-sm h-100">
                                <div className="icon-box bg-light-primary mb-3 mx-auto" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'}}>
                                    <Search className="text-primary" />
                                </div>
                                <h3 className="h5 fw-bold">Search Doctors</h3>
                                <p className="text-muted small">Find the best specialists near you with advanced filters.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white shadow-sm h-100">
                                <div className="icon-box bg-light-success mb-3 mx-auto" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'}}>
                                    <Calendar className="text-success" />
                                </div>
                                <h3 className="h5 fw-bold">Instant Booking</h3>
                                <p className="text-muted small">Choose your preferred time slot and confirm in seconds.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white shadow-sm h-100">
                                <div className="icon-box bg-light-info mb-3 mx-auto" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'}}>
                                    <ShieldCheck className="text-info" />
                                </div>
                                <h3 className="h5 fw-bold">Secure Reports</h3>
                                <p className="text-muted small">Your medical data is encrypted and securely stored.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
