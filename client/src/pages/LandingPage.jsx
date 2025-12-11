import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, ArrowRight, CheckCircle, Sparkles, Video, Shield, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Default ceremony icons as fallback
const ceremonyIcons = {
    'satyanarayan': '🙏',
    'grihapravesh': '🏠',
    'naamkaranam': '👶',
    'ganapathi': '🐘',
    'upanayanam': '📿',
    'bhumi': '🌍',
    'navagraha': '🪐',
    'vivah': '💒',
    'shanti': '☮️',
    'default': '🕉️'
};

const getIconForCeremony = (ceremony) => {
    const slug = ceremony.slug?.toLowerCase() || '';
    for (const key in ceremonyIcons) {
        if (slug.includes(key)) return ceremonyIcons[key];
    }
    return ceremony.icon || ceremonyIcons.default;
};

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
                setCeremonies(res.data.slice(0, 8));
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

    // 3 main service categories
    const serviceCategories = [
        {
            title: 'Pandit Booking',
            subtitle: 'For Pujas & Ceremonies',
            icon: '🕉️',
            gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            link: '/pandits',
            cta: 'Book Pandit'
        },
        {
            title: 'Dosha Remedies',
            subtitle: 'Manglik, Kaal Sarp & More',
            icon: '🔮',
            gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
            link: '/doshas',
            cta: 'Explore'
        },
        {
            title: 'e-Pujas Online',
            subtitle: 'Live Temple Pujas',
            icon: '📱',
            gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
            link: '/epujas',
            cta: 'View'
        }
    ];

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
                padding: '1.5rem 1rem 1.25rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: 'rgba(251,191,36,0.2)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        marginBottom: '0.6rem'
                    }}>
                        <Sparkles size={12} style={{ color: '#FBBF24' }} />
                        <span>Trusted by 10,000+ devotees</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: '700',
                        marginBottom: '0.4rem',
                        lineHeight: '1.2'
                    }}>
                        Book a Pandit for Your <span style={{ color: '#FBBF24' }}>Ceremony</span>
                    </h1>

                    <p style={{
                        fontSize: '0.85rem',
                        opacity: 0.9,
                        maxWidth: '500px',
                        margin: '0 auto 0.75rem'
                    }}>
                        Select a puja, pick your date & time, and we'll assign a verified pandit
                    </p>

                    {/* Scrolling Marquee - 3 Offerings */}
                    <div className="marquee-container" style={{
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 0',
                        marginTop: '0.5rem'
                    }}>
                        <div className="marquee-content" style={{
                            display: 'flex',
                            gap: '2rem',
                            animation: 'marquee 20s linear infinite',
                            whiteSpace: 'nowrap',
                            flexWrap: 'nowrap',
                            width: 'max-content'
                        }}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} style={{ display: 'inline-flex', gap: '2rem', flexWrap: 'nowrap', flexShrink: 0 }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', flexShrink: 0 }}>
                                        🕉️ <strong>Pandit Booking</strong> - Pujas & Ceremonies
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', flexShrink: 0 }}>
                                        🔮 <strong>Dosha Remedies</strong> - Manglik, Kaal Sarp
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', flexShrink: 0 }}>
                                        📱 <strong>e-Pujas Online</strong> - Live Temple Pujas
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Marquee Animation CSS */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
            `}</style>

            {/* Stats Bar */}
            <section style={{
                background: 'white',
                padding: '0.6rem 1rem',
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
                            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3 Service Categories */}
            <section className="container" style={{ padding: '1.5rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.2rem', fontWeight: '700' }}>
                        Our Services
                    </h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Select a service to get started</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                }}>
                    {serviceCategories.map((service, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(service.link)}
                            style={{
                                background: service.gradient,
                                borderRadius: '0.75rem',
                                padding: '1.25rem 1rem',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{service.icon}</div>
                            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.2rem', fontWeight: '600' }}>{service.title}</h3>
                            <p style={{ opacity: 0.9, fontSize: '0.7rem', marginBottom: '0.6rem' }}>{service.subtitle}</p>
                            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                {service.cta} <ArrowRight size={12} />
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ceremonies Grid - 10% larger */}
            <section className="container" style={{ padding: '1.25rem 1rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.2rem', fontWeight: '700' }}>
                        Popular Ceremonies
                    </h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Book a pandit for these pujas</p>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', fontSize: '0.85rem' }}>Loading...</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1rem'
                    }}>
                        {ceremonies.map(ceremony => (
                            <div
                                key={ceremony.id}
                                className="card"
                                onClick={() => handleCeremonyClick(ceremony)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '1.1rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                                    {/* Icon - Always show emoji, with image as overlay if available */}
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '0.5rem',
                                        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        flexShrink: 0
                                    }}>
                                        {getIconForCeremony(ceremony)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{ceremony.title}</h3>
                                        {ceremony.duration && (
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={11} /> {ceremony.duration}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginBottom: '0.7rem', lineHeight: '1.4' }}>
                                    {ceremony.description?.substring(0, 70)}...
                                </p>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                                    >
                                        Book Now
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
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
            <section style={{ background: '#F9FAFB', padding: '1.25rem 1rem' }}>
                <div className="container">
                    <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--secondary)', fontSize: '1rem' }}>
                        How It Works
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                        gap: '1rem'
                    }}>
                        {[
                            { icon: <Calendar size={18} />, title: 'Select Puja', desc: 'Choose ceremony' },
                            { icon: <Clock size={18} />, title: 'Pick Slot', desc: 'Date & time' },
                            { icon: <CheckCircle size={18} />, title: 'Get Pandit', desc: 'Get matched' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #A855F7 100%)',
                                    borderRadius: '0.6rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 0.5rem',
                                    color: 'white'
                                }}>
                                    {item.icon}
                                </div>
                                <h4 style={{ marginBottom: '0.2rem', color: 'var(--secondary)', fontSize: '0.85rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '1.25rem 1rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                        <div>
                            <Shield size={20} style={{ color: '#FBBF24', marginBottom: '0.3rem' }} />
                            <h4 style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>Verified</h4>
                        </div>
                        <div>
                            <Clock size={20} style={{ color: '#FBBF24', marginBottom: '0.3rem' }} />
                            <h4 style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>On-Time</h4>
                        </div>
                        <div>
                            <Star size={20} style={{ color: '#FBBF24', marginBottom: '0.3rem' }} />
                            <h4 style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>4.8+ Rated</h4>
                        </div>
                        <div>
                            <Video size={20} style={{ color: '#FBBF24', marginBottom: '0.3rem' }} />
                            <h4 style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>e-Puja</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                color: 'white',
                padding: '1.25rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ marginBottom: '0.4rem', fontSize: '1.05rem' }}>
                        Ready to Book?
                    </h2>
                    <p style={{ opacity: 0.9, marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                        Join thousands of happy families
                    </p>
                    <button
                        onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                        className="btn"
                        style={{
                            background: 'white',
                            color: '#7C3AED',
                            padding: '0.6rem 1.25rem',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            border: 'none',
                            borderRadius: '0.4rem',
                            cursor: 'pointer'
                        }}
                    >
                        {user ? 'Go to Dashboard' : 'Get Started'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
