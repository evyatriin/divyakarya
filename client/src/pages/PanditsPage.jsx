import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Clock, CheckCircle, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PanditsPage = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [pandits, setPandits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPandits = async () => {
            try {
                // For public listing, we'll show some sample data
                // In future, can connect to a public pandits endpoint
                setPandits([
                    {
                        id: 1,
                        name: 'Pandit Ramesh Sharma',
                        specialization: 'Vedic Rituals, Grihapravesh',
                        experience: 15,
                        rating: 4.9,
                        totalReviews: 234,
                        languages: ['Hindi', 'Sanskrit', 'English'],
                        photo: null,
                        isVerified: true
                    },
                    {
                        id: 2,
                        name: 'Pandit Suresh Iyer',
                        specialization: 'Marriage Ceremonies, Upanayanam',
                        experience: 20,
                        rating: 4.8,
                        totalReviews: 189,
                        languages: ['Tamil', 'Sanskrit', 'English'],
                        photo: null,
                        isVerified: true
                    },
                    {
                        id: 3,
                        name: 'Pandit Venkat Rao',
                        specialization: 'Shanti Pujas, Dosha Remedies',
                        experience: 12,
                        rating: 4.7,
                        totalReviews: 156,
                        languages: ['Telugu', 'Sanskrit', 'Hindi'],
                        photo: null,
                        isVerified: true
                    },
                    {
                        id: 4,
                        name: 'Pandit Krishna Murthy',
                        specialization: 'Temple Rituals, Homam',
                        experience: 25,
                        rating: 4.9,
                        totalReviews: 312,
                        languages: ['Kannada', 'Sanskrit', 'English'],
                        photo: null,
                        isVerified: true
                    }
                ]);
            } catch (error) {
                console.error('Error fetching pandits:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPandits();
    }, [language]);

    return (
        <div className="animate-fade-in" style={{ background: 'var(--background)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                color: 'white',
                padding: '3rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <Users size={16} /> Expert Pandits
                    </div>
                    <h1 style={{ marginBottom: '1rem' }}>
                        Our Verified Pandits
                    </h1>
                    <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                        All our pandits are verified, experienced, and trained in authentic vedic traditions. Book with confidence.
                    </p>
                </div>
            </section>

            {/* Trust Badges */}
            <section style={{ background: 'white', padding: '1.5rem 1rem', borderBottom: '1px solid #eee' }}>
                <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={20} style={{ color: '#10B981' }} />
                        <span style={{ fontSize: '0.9rem' }}>Background Verified</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Star size={20} style={{ color: '#F59E0B' }} />
                        <span style={{ fontSize: '0.9rem' }}>4.5+ Rating Required</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={20} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.9rem' }}>On-Time Guarantee</span>
                    </div>
                </div>
            </section>

            {/* Pandits Grid */}
            <section className="container" style={{ padding: '3rem 1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--secondary)' }}>Meet Our Pandits</h2>
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading pandits...</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {pandits.map((pandit) => (
                            <div key={pandit.id} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    color: 'white',
                                    fontSize: '2rem'
                                }}>
                                    {pandit.name.charAt(0)}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0 }}>{pandit.name}</h3>
                                    {pandit.isVerified && (
                                        <CheckCircle size={16} style={{ color: '#10B981' }} title="Verified" />
                                    )}
                                </div>

                                <p style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    {pandit.specialization}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                    <span><Clock size={14} style={{ marginRight: '0.25rem' }} />{pandit.experience} yrs</span>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <Star size={14} style={{ marginRight: '0.25rem', color: '#F59E0B' }} />
                                        {pandit.rating} ({pandit.totalReviews})
                                    </span>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    {pandit.languages.map((lang, i) => (
                                        <span key={i} style={{
                                            display: 'inline-block',
                                            background: '#F3F4F6',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.75rem',
                                            margin: '0.15rem'
                                        }}>{lang}</span>
                                    ))}
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Book Pandit
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '3rem 1rem', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '1rem' }}>Want to Become a Pandit Partner?</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
                        Join our network of verified pandits and connect with devotees across the country.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/register')}>
                        Register as Pandit
                    </button>
                </div>
            </section>
        </div>
    );
};

export default PanditsPage;
