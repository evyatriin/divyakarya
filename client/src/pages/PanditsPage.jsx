import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
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

    const handleBookCeremony = (ceremony) => {
        navigate(`/ceremony/${ceremony.slug}`);
    };

    return (
        <div className="animate-fade-in" style={{ background: 'var(--background)', minHeight: '100vh' }}>
            {/* Hero Section - Compact */}
            <section style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                color: 'white',
                padding: '2rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                        <CheckCircle size={14} /> Verified Pandits
                    </div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        Book a Pandit for Puja
                    </h1>
                    <p style={{ opacity: 0.9, maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem' }}>
                        Select a ceremony below. Our verified pandits will be assigned based on your location and preferred date.
                    </p>
                </div>
            </section>

            {/* Trust Badges - Compact */}
            <section style={{ background: 'white', padding: '1rem', borderBottom: '1px solid #eee' }}>
                <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <CheckCircle size={16} style={{ color: '#10B981' }} />
                        <span>Background Verified</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Star size={16} style={{ color: '#F59E0B' }} />
                        <span>4.5+ Rating</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Clock size={16} style={{ color: 'var(--primary)' }} />
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
                    Choose the puja or ceremony you need, and we'll assign the best pandit for you
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
                                onClick={() => handleBookCeremony(ceremony)}
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
                                        <div style={{
                                            fontSize: '2rem',
                                            width: '48px',
                                            height: '48px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>{ceremony.icon}</div>
                                    )}
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem' }}>{ceremony.title}</h3>
                                        {ceremony.duration && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                                <Clock size={12} style={{ marginRight: '0.25rem' }} />
                                                {ceremony.duration}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                                    {ceremony.description?.substring(0, 80)}...
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {ceremony.basePrice && (
                                        <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.95rem' }}>
                                            ₹{ceremony.basePrice.toLocaleString('en-IN')} onwards
                                        </span>
                                    )}
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                    >
                                        Book <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* How It Works - Compact */}
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

            {/* CTA Section - Compact */}
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
