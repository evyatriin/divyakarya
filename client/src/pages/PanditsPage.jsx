import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, ArrowRight, Shield, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PanditsPage = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [ceremonies, setCeremonies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCeremonies = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/ceremonies?lang=${language}`);
                setCeremonies(res.data);
            } catch (error) {
                console.error('Error fetching ceremonies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCeremonies();
    }, [language]);

    const handleCeremonyClick = (ceremony) => {
        navigate(`/ceremony/${ceremony.slug}`);
    };

    return (
        <div className="animate-fade-in" style={{ background: 'var(--background)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                color: 'white',
                padding: '2rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        Book a Pandit for Your Ceremony
                    </h1>
                    <p style={{ opacity: 0.9, maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem' }}>
                        Select a ceremony below and we'll assign a verified pandit based on your date and location.
                    </p>
                </div>
            </section>

            {/* Trust Badges */}
            <section style={{ background: 'white', padding: '1rem', borderBottom: '1px solid #eee' }}>
                <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <CheckCircle size={16} style={{ color: '#10B981' }} />
                        <span>Background Verified</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Star size={16} style={{ color: '#F59E0B' }} />
                        <span>4.5+ Rated</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Shield size={16} style={{ color: 'var(--primary)' }} />
                        <span>On-Time Guarantee</span>
                    </div>
                </div>
            </section>

            {/* Ceremonies Grid */}
            <section className="container" style={{ padding: '2rem 1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--secondary)', fontSize: '1.25rem' }}>
                    Select a Ceremony
                </h2>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    Choose the puja you need — our admin will assign the best available pandit
                </p>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading ceremonies...</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '1rem'
                    }}>
                        {ceremonies.map((ceremony) => (
                            <div
                                key={ceremony.id}
                                className="card"
                                style={{
                                    padding: '1.25rem',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onClick={() => handleCeremonyClick(ceremony)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    {ceremony.image ? (
                                        <img
                                            src={ceremony.image}
                                            alt={ceremony.title}
                                            style={{ width: '48px', height: '48px', borderRadius: '0.5rem', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ fontSize: '2rem' }}>{ceremony.icon}</div>
                                    )}
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem' }}>{ceremony.title}</h3>
                                        {ceremony.duration && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={12} /> {ceremony.duration}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                                    {ceremony.description?.substring(0, 80)}...
                                </p>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                    >
                                        Book Now <ArrowRight size={14} />
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        style={{ flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.8rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/ceremony/${ceremony.slug}?muhurat=true`);
                                        }}
                                    >
                                        Find Muhurat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* How It Works */}
            <section style={{ background: '#F9FAFB', padding: '2rem 1rem' }}>
                <div className="container">
                    <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--secondary)', fontSize: '1.1rem' }}>
                        How Pandit Booking Works
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { step: '1', title: 'Select Ceremony', desc: 'Choose the puja you need' },
                            { step: '2', title: 'Pick Date & Time', desc: 'Select your preferred slot' },
                            { step: '3', title: 'Pandit Assigned', desc: 'We assign the best match' },
                            { step: '4', title: 'Puja at Home', desc: 'Pandit arrives on time' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: 'var(--primary)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 0.5rem',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>{item.step}</div>
                                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '2rem 1rem', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Want to Become a Pandit Partner?</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Join our network of verified pandits and connect with devotees.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/register')} style={{ padding: '0.6rem 1.5rem' }}>
                        Register as Pandit
                    </button>
                </div>
            </section>
        </div>
    );
};

export default PanditsPage;
