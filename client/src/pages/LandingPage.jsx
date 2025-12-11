import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, ArrowRight, CheckCircle, Sparkles, Video, Shield, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [ceremonies, setCeremonies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCeremonies = async () => {
            try {
                setLoading(true);
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

    const stats = [
        { value: '10K+', label: 'Families' },
        { value: '500+', label: 'Pandits' },
        { value: '50+', label: 'Cities' },
        { value: '4.9', label: 'Rating' }
    ];

    return (
        <div className="animate-fade-in" style={{ background: 'var(--background)' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                color: 'white',
                padding: '2rem 1rem 1.5rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'rgba(251,191,36,0.2)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        marginBottom: '0.75rem'
                    }}>
                        <Sparkles size={12} style={{ color: '#FBBF24' }} />
                        <span>Trusted by 10,000+ devotees</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        lineHeight: '1.2'
                    }}>
                        Book a Pandit for Your <span style={{ color: '#FBBF24' }}>Ceremony</span>
                    </h1>

                    <p style={{
                        fontSize: '0.9rem',
                        opacity: 0.9,
                        maxWidth: '500px',
                        margin: '0 auto 1rem'
                    }}>
                        Select a puja below, pick your date & time, and we'll assign a verified pandit
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user ? (
                            <button
                                onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'pandit' ? '/pandit' : '/dashboard')}
                                className="btn"
                                style={{
                                    background: '#FBBF24',
                                    color: '#1F2937',
                                    padding: '0.6rem 1.25rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    border: 'none',
                                    borderRadius: '0.4rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                Go to Dashboard <ArrowRight size={14} />
                            </button>
                        ) : (
                            <button
                                onClick={() => document.getElementById('ceremonies').scrollIntoView({ behavior: 'smooth' })}
                                className="btn"
                                style={{
                                    background: '#FBBF24',
                                    color: '#1F2937',
                                    padding: '0.6rem 1.25rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    border: 'none',
                                    borderRadius: '0.4rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                Book a Ceremony <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section style={{
                background: 'white',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #E5E7EB'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap'
                }}>
                    {stats.map((stat, idx) => (
                        <div key={idx} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ceremonies Grid - Main Section */}
            <section id="ceremonies" className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        color: 'var(--secondary)',
                        marginBottom: '0.25rem',
                        fontWeight: '700'
                    }}>
                        Select a Ceremony
                    </h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                        Choose a puja and we'll assign a verified pandit for you
                    </p>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading ceremonies...</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1rem'
                    }}>
                        {ceremonies.map(ceremony => (
                            <div
                                key={ceremony.id}
                                className="card"
                                onClick={() => handleCeremonyClick(ceremony)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '1.25rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
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
                                        <div style={{ fontSize: '2.5rem' }}>{ceremony.icon}</div>
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

                                <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                    {ceremony.description?.substring(0, 80)}...
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {ceremony.basePrice && (
                                        <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                            ₹{ceremony.basePrice.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                    >
                                        Book Now
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
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ color: 'var(--secondary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>How It Works</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Book your puja in 3 simple steps</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {[
                            { step: '1', icon: <Calendar size={20} />, title: 'Select Ceremony', desc: 'Choose puja from list' },
                            { step: '2', icon: <Clock size={20} />, title: 'Pick Date & Time', desc: 'Choose your slot' },
                            { step: '3', icon: <CheckCircle size={20} />, title: 'We Assign Pandit', desc: 'Verified pandit assigned' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #A855F7 100%)',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 0.5rem',
                                    color: 'white'
                                }}>
                                    {item.icon}
                                </div>
                                <h4 style={{ marginBottom: '0.25rem', color: 'var(--secondary)', fontSize: '0.85rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Services - Doshas & e-Pujas */}
            <section className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--secondary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>More Services</h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Explore additional offerings</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1rem'
                }}>
                    {/* Dosha Remedies Card */}
                    <div
                        onClick={() => navigate('/doshas')}
                        style={{
                            background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔮</div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Dosha Remedies</h3>
                        <p style={{ opacity: 0.9, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                            Manglik, Kaal Sarp, Pitra Dosha remedies
                        </p>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                            Explore <ArrowRight size={14} />
                        </span>
                    </div>

                    {/* e-Pujas Card */}
                    <div
                        onClick={() => navigate('/epujas')}
                        style={{
                            background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>e-Pujas Online</h3>
                        <p style={{ opacity: 0.9, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                            Live temple pujas & virtual ceremonies
                        </p>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                            Explore <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '1.5rem 1rem' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem' }}>Why DivyaKarya?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Shield size={24} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>Verified Pandits</h4>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Background verified</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Clock size={24} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>Flexible Timing</h4>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Your convenience</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Star size={24} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>4.8+ Rating</h4>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Quality service</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Video size={24} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>e-Puja Support</h4>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Join from anywhere</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                color: 'white',
                padding: '1.5rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                        Ready to Book Your Ceremony?
                    </h2>
                    <p style={{ opacity: 0.9, marginBottom: '1rem', fontSize: '0.85rem' }}>
                        Join thousands of families who trust DivyaKarya
                    </p>
                    <button
                        onClick={() => document.getElementById('ceremonies').scrollIntoView({ behavior: 'smooth' })}
                        className="btn"
                        style={{
                            background: 'white',
                            color: '#7C3AED',
                            padding: '0.6rem 1.5rem',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            border: 'none',
                            borderRadius: '0.4rem',
                            cursor: 'pointer'
                        }}
                    >
                        Browse Ceremonies
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
