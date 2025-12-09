import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Star, ArrowRight, CheckCircle, Sparkles, Video, Shield, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Carousel slides showcasing offerings
    const carouselSlides = [
        {
            title: 'Book Expert Pandits',
            subtitle: 'For Pujas, Weddings & Rituals',
            description: 'Verified and experienced pandits at your doorstep',
            icon: '🕉️',
            bg: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            cta: 'Book Now',
            link: '/dashboard'
        },
        {
            title: 'Dosha Remedies',
            subtitle: 'Manglik, Kaal Sarp, Pitra & More',
            description: 'Expert astrological remedies for peace and prosperity',
            icon: '🔮',
            bg: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
            cta: 'Explore Doshas',
            link: '/doshas'
        },
        {
            title: 'e-Pujas Online',
            subtitle: 'Live Temple & Personalized Pujas',
            description: 'Participate in sacred rituals from anywhere via video',
            icon: '📱',
            bg: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
            cta: 'View e-Pujas',
            link: '/epujas'
        },
        {
            title: 'Festival Special',
            subtitle: 'Navratri, Diwali, Shivratri',
            description: 'Book special pujas during auspicious occasions',
            icon: '🪔',
            bg: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            cta: 'Explore',
            link: '/epujas'
        }
    ];

    // Auto-rotate carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [carouselSlides.length]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/ceremonies?lang=${language}`);
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

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

    const doshas = [
        { name: 'Manglik Dosha', icon: '🔴', description: 'Remedies for Mars affliction in horoscope' },
        { name: 'Kaal Sarp Dosha', icon: '🐍', description: 'Puja to pacify Rahu-Ketu axis effects' },
        { name: 'Pitra Dosha', icon: '🙏', description: 'Ancestors blessing rituals and Shradh' },
        { name: 'Shani Dosha', icon: '⚫', description: 'Saturn appeasement for relief from hardships' }
    ];

    const ePujas = [
        { name: 'Live Temple Pujas', icon: '🛕', description: 'Participate in pujas from famous temples remotely', tag: 'Popular' },
        { name: 'Personalized e-Puja', icon: '📱', description: 'Custom puja performed by pandit on video call', tag: 'New' },
        { name: 'Daily Sankalp', icon: '🌅', description: 'Daily prayers and archana on your behalf', tag: '' },
        { name: 'Festival Special', icon: '🪔', description: 'Special pujas during Navratri, Diwali, Shivratri', tag: 'Seasonal' }
    ];

    return (
        <div className="animate-fade-in">
            {/* Carousel Banner */}
            <section style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
                {carouselSlides.map((slide, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: slide.bg,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '2rem',
                            opacity: idx === currentSlide ? 1 : 0,
                            transform: idx === currentSlide ? 'scale(1)' : 'scale(0.95)',
                            transition: 'opacity 0.6s ease, transform 0.6s ease',
                            pointerEvents: idx === currentSlide ? 'auto' : 'none'
                        }}
                    >
                        <div>
                            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{slide.icon}</div>
                            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>{slide.title}</h1>
                            <p style={{ fontSize: '1.25rem', opacity: 0.95, marginBottom: '0.25rem' }}>{slide.subtitle}</p>
                            <p style={{ opacity: 0.85, marginBottom: '1.5rem', fontSize: '1rem' }}>{slide.description}</p>
                            <button
                                onClick={() => navigate(user ? slide.link : '/login')}
                                className="btn"
                                style={{ background: 'white', color: '#333', padding: '0.6rem 1.5rem', fontWeight: '600' }}
                            >
                                {slide.cta} <ArrowRight size={16} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Carousel Controls */}
                <button onClick={prevSlide} style={{
                    position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                    width: '40px', height: '40px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}><ChevronLeft size={24} /></button>
                <button onClick={nextSlide} style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                    width: '40px', height: '40px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}><ChevronRight size={24} /></button>

                {/* Dots */}
                <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
                    {carouselSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            style={{
                                width: idx === currentSlide ? '24px' : '8px',
                                height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                                background: idx === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="container" style={{ padding: '3rem 1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--secondary)' }}>Our Pujas & Ceremonies</h2>
                {loading ? <p style={{ textAlign: 'center' }}>Loading services...</p> : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {services.map(service => (
                            <div
                                key={service.id}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    border: '1px solid transparent'
                                }}
                                onClick={() => handleServiceClick(service)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        style={{
                                            width: '100%', height: '140px', objectFit: 'cover',
                                            borderRadius: '8px', marginBottom: '0.75rem'
                                        }}
                                    />
                                ) : (
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{service.icon}</div>
                                )}
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{service.title}</h3>
                                <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>{service.description?.substring(0, 80)}...</p>
                                <button className="btn btn-outline" style={{ width: '100%', padding: '0.5rem' }}>Book Now</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Doshas Section */}
            <section id="doshas" style={{ background: '#FEF3C7', padding: '3rem 1rem' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Dosha Remedies</h2>
                        <p style={{ color: 'var(--text-light)' }}>Astrological remedies performed by experienced pandits</p>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {doshas.map((dosha, idx) => (
                            <div key={idx} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dosha.icon}</div>
                                <h4 style={{ marginBottom: '0.5rem', color: 'var(--secondary)' }}>{dosha.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{dosha.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* e-Pujas Section */}
            <section id="epujas" className="container" style={{ padding: '3rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                        <Video size={14} /> e-Pujas - Online Rituals
                    </div>
                    <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Virtual Puja Services</h2>
                    <p style={{ color: 'var(--text-light)' }}>Participate in sacred rituals from anywhere in the world</p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem'
                }}>
                    {ePujas.map((puja, idx) => (
                        <div key={idx} className="card" style={{ position: 'relative', padding: '1.25rem' }}>
                            {puja.tag && (
                                <span style={{
                                    position: 'absolute', top: '0.75rem', right: '0.75rem',
                                    background: puja.tag === 'New' ? '#10B981' : puja.tag === 'Popular' ? 'var(--primary)' : '#6B7280',
                                    color: 'white', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem'
                                }}>{puja.tag}</span>
                            )}
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{puja.icon}</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>{puja.name}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{puja.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '3rem 1rem' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why DivyaKarya?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Shield size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                            <h4>Verified Pandits</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>All pandits are background verified</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Clock size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                            <h4>Flexible Timing</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Book at your convenient time</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Star size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                            <h4>Quality Service</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Rated 4.8+ by our customers</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Sparkles size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                            <h4>Complete Rituals</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Traditional ceremonies performed completely</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

