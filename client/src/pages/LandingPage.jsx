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
                setCeremonies(res.data.slice(0, 6));
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
            subtitle: 'Pujas, Weddings & Rituals',
            description: 'Verified pandits at your doorstep',
            icon: '🕉️',
            gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            features: ['Verified', 'Flexible', '4.8+ Rating'],
            link: '/pandits',
            cta: 'Book Now'
        },
        {
            id: 'doshas',
            title: 'Dosha Remedies',
            subtitle: 'Manglik, Kaal Sarp & More',
            description: 'Expert astrological remedies',
            icon: '🔮',
            gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
            features: ['Astrologers', 'Vedic', 'Custom'],
            link: '/doshas',
            cta: 'Explore'
        },
        {
            id: 'epujas',
            title: 'e-Pujas Online',
            subtitle: 'Live Temple & Virtual Pujas',
            description: 'Sacred rituals from anywhere',
            icon: '📱',
            gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
            features: ['Live', 'Temples', 'Prasad'],
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
            {/* Hero Section - Compact */}
            <section style={{
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                color: 'white',
                padding: '2rem 1rem 1.5rem',
                textAlign: 'center',
                position: 'relative'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        lineHeight: '1.2'
                    }}>
                        Sacred Rituals, <span style={{ color: '#FBBF24' }}>Simplified</span>
                    </h1>

                    <p style={{
                        fontSize: '0.9rem',
                        opacity: 0.9,
                        maxWidth: '500px',
                        margin: '0 auto 1rem'
                    }}>
                        Book verified pandits, get dosha remedies, or join live e-pujas
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate(user ? '/dashboard' : '/login')}
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
                            Get Started <ArrowRight size={14} />
                        </button>
                        <button
                            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                            className="btn"
                            style={{
                                background: 'transparent',
                                color: 'white',
                                padding: '0.6rem 1.25rem',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '0.4rem',
                                cursor: 'pointer'
                            }}
                        >
                            Explore
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Bar - Compact */}
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

            {/* Main Services - 3 Pillars - Compact */}
            <section id="services" className="container" style={{ padding: '1.5rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        color: 'var(--secondary)',
                        marginBottom: '0.25rem',
                        fontWeight: '700'
                    }}>
                        What would you like to do?
                    </h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                        Complete your booking in just 3-4 clicks
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem'
                }}>
                    {serviceCategories.map((service) => (
                        <div
                            key={service.id}
                            onClick={() => navigate(service.link)}
                            style={{
                                background: 'white',
                                borderRadius: '0.75rem',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                            }}
                        >
                            {/* Gradient Header - Compact */}
                            <div style={{
                                background: service.gradient,
                                padding: '1.25rem',
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{service.icon}</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.15rem' }}>
                                    {service.title}
                                </h3>
                                <p style={{ opacity: 0.9, fontSize: '0.8rem' }}>{service.subtitle}</p>
                            </div>

                            {/* Content - Compact */}
                            <div style={{ padding: '1rem' }}>
                                <p style={{ color: 'var(--text-light)', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                                    {service.description}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                                    {service.features.map((feature, idx) => (
                                        <span key={idx} style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.2rem',
                                            background: '#F3F4F6',
                                            padding: '0.2rem 0.4rem',
                                            borderRadius: '0.2rem',
                                            fontSize: '0.65rem',
                                            color: 'var(--secondary)'
                                        }}>
                                            <CheckCircle size={10} style={{ color: '#10B981' }} />
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
                                        padding: '0.5rem',
                                        border: 'none',
                                        borderRadius: '0.35rem',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.35rem'
                                    }}
                                >
                                    {service.cta} <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Ceremonies - Compact */}
            {!loading && ceremonies.length > 0 && (
                <section style={{ background: '#F9FAFB', padding: '1.5rem 1rem' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '1rem',
                                fontSize: '0.7rem',
                                marginBottom: '0.5rem'
                            }}>
                                <Calendar size={12} /> Popular Ceremonies
                            </div>
                            <h2 style={{ color: 'var(--secondary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Our Pujas & Ceremonies</h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '0.75rem'
                        }}>
                            {ceremonies.map(ceremony => (
                                <div
                                    key={ceremony.id}
                                    className="card"
                                    onClick={() => handleServiceClick(ceremony)}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        padding: '1rem'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        {ceremony.image ? (
                                            <img
                                                src={ceremony.image}
                                                alt={ceremony.title}
                                                style={{ width: '36px', height: '36px', borderRadius: '0.4rem', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ fontSize: '1.5rem' }}>{ceremony.icon}</div>
                                        )}
                                        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{ceremony.title}</h4>
                                    </div>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                                        {ceremony.description?.substring(0, 60)}...
                                    </p>
                                    <button className="btn btn-outline" style={{ width: '100%', padding: '0.35rem', fontSize: '0.8rem' }}>
                                        Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* How It Works - Compact */}
            <section className="container" style={{ padding: '1.5rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ color: 'var(--secondary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>How It Works</h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Book your puja in 3 simple steps</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                }}>
                    {[
                        { step: '1', icon: <Calendar size={20} />, title: 'Choose Service', desc: 'Select puja or dosha' },
                        { step: '2', icon: <Users size={20} />, title: 'Pick Date', desc: 'Select date & pandit' },
                        { step: '3', icon: <Zap size={20} />, title: 'Confirm', desc: 'Pay & we handle rest' }
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
            </section>

            {/* Why Choose Us - Compact */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '1.5rem 1rem' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem' }}>Why DivyaKarya?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Shield size={24} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>Verified</h4>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Background verified pandits</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Clock size={24} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>Flexible</h4>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Book at your convenience</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Star size={24} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>Quality</h4>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>4.8+ rated service</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Video size={24} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>e-Puja</h4>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Join live from anywhere</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Compact */}
            <section style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                color: 'white',
                padding: '1.5rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                        Ready to Begin Your Spiritual Journey?
                    </h2>
                    <p style={{ opacity: 0.9, marginBottom: '1rem', fontSize: '0.85rem' }}>
                        Join thousands of families who trust DivyaKarya
                    </p>
                    <button
                        onClick={() => navigate(user ? '/dashboard' : '/register')}
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
                        {user ? 'Go to Dashboard' : 'Create Free Account'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
