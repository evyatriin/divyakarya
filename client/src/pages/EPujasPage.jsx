import { useNavigate } from 'react-router-dom';
import { Video, Calendar, CheckCircle, Globe, Clock } from 'lucide-react';

const EPujasPage = () => {
    const navigate = useNavigate();

    const ePujas = [
        {
            name: 'Live Temple Pujas',
            icon: '🛕',
            tag: 'Popular',
            description: 'Participate in pujas from famous temples across India remotely',
            details: 'Watch and participate in live pujas from renowned temples like Tirupati, Shirdi, Vaishno Devi, and more. Receive prasad at your doorstep.',
            temples: ['Tirupati Balaji', 'Shirdi Sai Baba', 'Vaishno Devi', 'Siddhivinayak'],
            price: '₹1,100 onwards'
        },
        {
            name: 'Personalized e-Puja',
            icon: '📱',
            tag: 'New',
            description: 'Custom puja performed by pandit on video call with your presence',
            details: 'One-on-one puja session with a verified pandit via video call. Participate in real-time, ask questions, and receive personalized blessings.',
            features: ['Live Video Call', 'Personal Sankalp', 'Real-time Mantras', 'Digital Recording'],
            price: '₹2,100 onwards'
        },
        {
            name: 'Daily Sankalp',
            icon: '🌅',
            tag: 'Subscription',
            description: 'Daily prayers and archana performed on your behalf',
            details: 'Subscribe to daily prayers where a pandit performs archana, lights diya, and does sankalp in your name every morning.',
            features: ['Daily Morning Puja', 'Weekly Reports', 'Festival Special Pujas', 'Family Coverage'],
            price: '₹999/month'
        },
        {
            name: 'Festival Special Pujas',
            icon: '🪔',
            tag: 'Seasonal',
            description: 'Special pujas during Navratri, Diwali, Shivratri, and other festivals',
            details: 'Participate in elaborate pujas conducted during major Hindu festivals. Perfect for those away from home during festivals.',
            festivals: ['Navratri', 'Diwali Lakshmi Puja', 'Maha Shivratri', 'Ganesh Chaturthi'],
            price: '₹1,500 onwards'
        },
        {
            name: 'Satyanarayan Katha e-Puja',
            icon: '📿',
            tag: 'Popular',
            description: 'Complete Satyanarayan Puja via video conference',
            details: 'Full Satyanarayan Katha performed virtually with your family participation. Includes all rituals and katha narration.',
            includes: ['Complete Katha', 'All Mantras', 'Prasad Delivery', 'Family Participation'],
            price: '₹2,500'
        },
        {
            name: 'Ancestor Rituals Online',
            icon: '🕯️',
            tag: '',
            description: 'Tarpan and Shradh ceremonies performed at sacred ghats',
            details: 'Pitra Tarpan and Shradh rituals performed at sacred locations like Haridwar, Varanasi, or Gaya with live streaming.',
            locations: ['Har Ki Pauri, Haridwar', 'Dashashwamedh Ghat, Varanasi', 'Vishnupad Temple, Gaya'],
            price: '₹3,000 onwards'
        }
    ];

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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {ePujas.map((puja, idx) => (
                        <div key={idx} className="card" style={{ position: 'relative', padding: '1.5rem' }}>
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
                                {puja.details}
                            </p>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {(puja.temples || puja.features || puja.festivals || puja.includes || puja.locations || []).slice(0, 3).map((item, i) => (
                                        <span key={i} style={{
                                            background: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem'
                                        }}>{item}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>{puja.price}</span>
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
