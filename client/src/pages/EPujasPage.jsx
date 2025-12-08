import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Video, CheckCircle, Globe, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const EPujasPage = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [ePujas, setEPujas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEPujas = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/epujas?lang=${language}`);
                setEPujas(res.data);
            } catch (error) {
                console.error('Error fetching e-pujas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEPujas();
    }, [language]);

    const formatPrice = (price, priceType) => {
        const formatted = `₹${price.toLocaleString('en-IN')}`;
        if (priceType === 'starting') return `${formatted} onwards`;
        if (priceType === 'monthly') return `${formatted}/month`;
        return formatted;
    };

    const benefits = [
        { icon: <Globe size={24} />, title: 'Access Anywhere', desc: 'Join from any location worldwide' },
        { icon: <Video size={24} />, title: 'Live Streaming', desc: 'HD quality live puja broadcast' },
        { icon: <CheckCircle size={24} />, title: 'Verified Pandits', desc: 'All pandits are background verified' },
        { icon: <Clock size={24} />, title: 'Flexible Timing', desc: 'Schedule at your convenience' }
    ];

    return (
        <div className="animate-fade-in" style={{ background: 'var(--background)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                color: 'white',
                padding: '3rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <Video size={16} /> Virtual Puja Services
                    </div>
                    <h1 style={{ marginBottom: '1rem' }}>
                        e-Pujas: Sacred Rituals, Online
                    </h1>
                    <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                        Experience the divine from anywhere in the world. Participate in live pujas, temple sevas, and personalized rituals through video.
                    </p>
                </div>
            </section>

            {/* Benefits Strip */}
            <section style={{ background: 'white', padding: '1.5rem 1rem', borderBottom: '1px solid #eee' }}>
                <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                    {benefits.map((b, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--primary)' }}>{b.icon}</span>
                            <div>
                                <strong style={{ fontSize: '0.9rem' }}>{b.title}</strong>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>{b.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* e-Pujas Grid */}
            <section className="container" style={{ padding: '3rem 1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--secondary)' }}>Our Virtual Puja Services</h2>
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading e-pujas...</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {ePujas.map((puja) => (
                            <div key={puja.id} className="card" style={{ position: 'relative', padding: '1.5rem' }}>
                                {puja.tag && (
                                    <span style={{
                                        position: 'absolute', top: '1rem', right: '1rem',
                                        background: puja.tag === 'New' ? '#10B981' : puja.tag === 'Popular' ? 'var(--primary)' : puja.tag === 'Subscription' ? '#6366F1' : '#6B7280',
                                        color: 'white', padding: '0.2rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.7rem'
                                    }}>{puja.tag}</span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2rem' }}>{puja.icon}</span>
                                    <h3 style={{ margin: 0 }}>{puja.name}</h3>
                                </div>
                                <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                    {puja.details || puja.description}
                                </p>
                                {puja.features && puja.features.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {puja.features.slice(0, 3).map((item, i) => (
                                                <span key={i} style={{
                                                    background: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem'
                                                }}>{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>
                                        {formatPrice(puja.price, puja.priceType)}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '3rem 1rem', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '1rem' }}>Can't Find What You're Looking For?</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
                        Contact us for custom puja requirements. We can arrange any vedic ceremony virtually.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/contact')}>
                        Contact Us
                    </button>
                </div>
            </section>
        </div>
    );
};

export default EPujasPage;
