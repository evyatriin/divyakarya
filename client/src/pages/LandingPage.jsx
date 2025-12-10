import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, ArrowRight, CheckCircle, Sparkles, Video, Shield, Clock, Users, Calendar, Zap } from 'lucide-react';
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
                setCeremonies(res.data.slice(0, 6)); // Show top 6 ceremonies
            } catch (error) {
                console.error('Error fetching ceremonies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCeremonies();
    }, [language]);

    const handleServiceClick = (service) => {
        navigate(`/ceremony/${service.slug}`);
    };

    // Main service categories - the 3 pillars
    const serviceCategories = [
        {
            id: 'pandits',
            title: 'Book a Pandit',
            subtitle: 'For Pujas, Weddings & Rituals',
            description: 'Verified and experienced pandits at your doorstep for all ceremonies',
            icon: '🕉️',
            gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)',
            features: ['Background Verified', 'Flexible Timing', '4.8+ Rating'],
            link: '/pandits',
            cta: 'Find Pandits'
        },
        {
            id: 'doshas',
            title: 'Dosha Remedies',
            subtitle: 'Manglik, Kaal Sarp, Pitra & More',
            description: 'Expert astrological remedies for peace, prosperity and life harmony',
            icon: '🔮',
            gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #F87171 100%)',
            features: ['Expert Astrologers', 'Vedic Rituals', 'Personalized Solutions'],
            link: '/doshas',
            cta: 'Explore Doshas'
        },
        {
            id: 'epujas',
            title: 'e-Pujas Online',
            subtitle: 'Live Temple & Virtual Pujas',
            description: 'Participate in sacred rituals from anywhere via live video streaming',
            icon: '📱',
            gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
            features: ['Live Streaming', 'Famous Temples', 'Prasad Delivery'],
            link: '/epujas',
            cta: 'View e-Pujas'
        }
    ];

    const stats = [
        { value: '10,000+', label: 'Happy Families' },
        { value: '500+', label: 'Verified Pandits' },
        { value: '50+', label: 'Cities Covered' },
        { value: '4.9', label: 'Average Rating' }
    ];

    return (
        <div className="animate-fade-in" style={{ background: 'var(--background)' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 50%, #4B5563 100%)',
                color: 'white',
                padding: '4rem 1rem 3rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-20%',
                    width: '50%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-50%',
                    right: '-20%',
                    width: '50%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(251,191,36,0.2)',
                        border: '1px solid rgba(251,191,36,0.3)',
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        marginBottom: '1.5rem'
                    }}>
                        <Sparkles size={16} style={{ color: '#FBBF24' }} />
                        <span>Trusted by 10,000+ devotees</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        lineHeight: '1.2'
                    }}>
                        Sacred Rituals,<br />
                        <span style={{ color: '#FBBF24' }}>Simplified</span>
                    </h1>

                    <p style={{
                        fontSize: '1.1rem',
                        opacity: 0.9,
                        maxWidth: '600px',
                        margin: '0 auto 2rem',
                        lineHeight: '1.6'
                    }}>
                        Book verified pandits, get dosha remedies, or join live e-pujas — all in just a few clicks
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate(user ? '/dashboard' : '/login')}
                            className="btn"
                            style={{
                                background: '#FBBF24',
                                color: '#1F2937',
                                padding: '0.875rem 2rem',
                                fontWeight: '600',
                                fontSize: '1rem',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Get Started <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                            className="btn"
                            style={{
                                background: 'transparent',
                                color: 'white',
                                padding: '0.875rem 2rem',
                                fontWeight: '600',
                                fontSize: '1rem',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderRadius: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            Explore Services
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section style={{
                background: 'white',
                padding: '1.5rem 1rem',
                borderBottom: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div className="container" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1rem',
                    textAlign: 'center'
                }}>
                    {stats.map((stat, idx) => (
                        <div key={idx}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Services - 3 Pillars */}
            <section id="services" className="container" style={{ padding: '4rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        color: 'var(--secondary)',
                        marginBottom: '0.75rem',
                        fontWeight: '700'
                    }}>
                        What would you like to do?
                    </h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                        Choose a service and complete your booking in just 3-4 clicks
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {serviceCategories.map((service) => (
                        <div
                            key={service.id}
                            onClick={() => navigate(service.link)}
                            style={{
                                background: 'white',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
                            }}
                        >
                            {/* Gradient Header */}
                            <div style={{
                                background: service.gradient,
                                padding: '2rem',
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{service.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                                    {service.title}
                                </h3>
                                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>{service.subtitle}</p>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    {service.description}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                    {service.features.map((feature, idx) => (
                                        <span key={idx} style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            background: '#F3F4F6',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.75rem',
                                            color: 'var(--secondary)'
                                        }}>
                                            <CheckCircle size={12} style={{ color: '#10B981' }} />
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        background: service.gradient,
                                        color: 'white',
                                        padding: '0.75rem',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    {service.cta} <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Ceremonies */}
            {!loading && ceremonies.length > 0 && (
                <section style={{ background: '#F9FAFB', padding: '4rem 1rem' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                marginBottom: '0.75rem'
                            }}>
                                <Calendar size={14} /> Popular Ceremonies
                            </div>
                            <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Our Pujas & Ceremonies</h2>
                            <p style={{ color: 'var(--text-light)' }}>Book pandits for these traditional ceremonies</p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '1.25rem'
                        }}>
                            {ceremonies.map(ceremony => (
                                <div
                                    key={ceremony.id}
                                    className="card"
                                    onClick={() => handleServiceClick(ceremony)}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        padding: '1.25rem'
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
                                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{ceremony.title}</h4>
                                    </div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                        {ceremony.description?.substring(0, 70)}...
                                    </p>
                                    <button className="btn btn-outline" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>
                                        Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* How It Works */}
            <section className="container" style={{ padding: '4rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>How It Works</h2>
                    <p style={{ color: 'var(--text-light)' }}>Book your puja in 3 simple steps</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '2rem'
                }}>
                    {[
                        { step: '1', icon: <Calendar size={28} />, title: 'Choose Service', desc: 'Select puja, dosha remedy, or e-puja' },
                        { step: '2', icon: <Users size={28} />, title: 'Pick Date & Pandit', desc: 'Select convenient date and verified pandit' },
                        { step: '3', icon: <Zap size={28} />, title: 'Confirm & Relax', desc: 'Complete payment and we handle the rest' }
                    ].map((item, idx) => (
                        <div key={idx} style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, var(--primary) 0%, #A855F7 100%)',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: 'white'
                            }}>
                                {item.icon}
                            </div>
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--secondary)' }}>{item.title}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '4rem 1rem' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Why DivyaKarya?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Shield size={36} style={{ color: '#FBBF24', marginBottom: '0.75rem' }} />
                            <h4>Verified Pandits</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>All pandits are background verified and experienced</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Clock size={36} style={{ color: '#FBBF24', marginBottom: '0.75rem' }} />
                            <h4>Flexible Timing</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Book at your convenient time & date</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Star size={36} style={{ color: '#FBBF24', marginBottom: '0.75rem' }} />
                            <h4>Quality Service</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Rated 4.8+ by our satisfied customers</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Video size={36} style={{ color: '#FBBF24', marginBottom: '0.75rem' }} />
                            <h4>e-Puja Support</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Join live pujas from anywhere in the world</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                color: 'white',
                padding: '4rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ marginBottom: '1rem', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                        Ready to Begin Your Spiritual Journey?
                    </h2>
                    <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        Join thousands of families who trust DivyaKarya for their sacred ceremonies
                    </p>
                    <button
                        onClick={() => navigate(user ? '/dashboard' : '/register')}
                        className="btn"
                        style={{
                            background: 'white',
                            color: '#7C3AED',
                            padding: '1rem 2.5rem',
                            fontWeight: '600',
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        {user ? 'Go to Dashboard' : 'Create Free Account'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
