import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Star, ArrowRight, CheckCircle } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/ceremonies?lang=${language}`);
                setServices(res.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [language]);

    const handleServiceClick = (service) => {
        navigate(`/ceremony/${service.slug}`);
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(to bottom, var(--background), #fff)',
                padding: '4rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                        Find the Perfect Pandit for Your Ceremony
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Book experienced and verified Pandits for Pujas, Weddings, and Rituals in just a few clicks.
                    </p>
                    <button
                        onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                        className="btn btn-primary"
                        style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                    >
                        Explore Services
                    </button>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="container" style={{ padding: '4rem 1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--secondary)' }}>Our Services</h2>
                {loading ? <p style={{ textAlign: 'center' }}>Loading services...</p> : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {services.map(service => (
                            <div
                                key={service.id}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    border: '1px solid transparent'
                                }}
                                onClick={() => handleServiceClick(service)}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.icon}</div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{service.title}</h3>
                                <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>{service.description.substring(0, 100)}...</p>
                                <button className="btn btn-outline" style={{ width: '100%' }}>Select</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default LandingPage;
