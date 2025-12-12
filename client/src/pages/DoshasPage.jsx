import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Clock, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DoshasPage = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [doshas, setDoshas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLocationsModal, setShowLocationsModal] = useState(null);

    useEffect(() => {
        const fetchDoshas = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/doshas?lang=${language}`);
                setDoshas(res.data);
            } catch (error) {
                console.error('Error fetching doshas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoshas();
    }, [language]);

    const formatPrice = (price) => {
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <div className="animate-fade-in" style={{ background: 'var(--background)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
                padding: '3rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
                        Dosha Remedies & Shanti Pujas
                    </h1>
                    <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
                        Expert astrological remedies performed by experienced vedic pandits to remove doshas and bring peace and prosperity to your life.
                    </p>
                </div>
            </section>

            {/* Doshas Grid */}
            <section className="container" style={{ padding: '3rem 1rem' }}>
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading doshas...</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {doshas.map((dosha) => (
                            <div key={dosha.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2.5rem' }}>{dosha.icon}</span>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{dosha.name}</h3>
                                </div>

                                {/* Description */}
                                <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    {dosha.description}
                                </p>

                                {/* Meta Info */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={14} /> {dosha.duration}
                                    </span>
                                    {dosha.mode && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <MapPin size={14} /> {dosha.mode.split('/')[0].trim()}
                                        </span>
                                    )}
                                </div>

                                {/* Recommended When - First 2 items */}
                                {dosha.recommendedWhen && dosha.recommendedWhen.length > 0 && (
                                    <div style={{ marginBottom: '1rem', flex: 1 }}>
                                        <strong style={{ fontSize: '0.8rem', color: 'var(--text)', display: 'block', marginBottom: '0.5rem' }}>Recommended For:</strong>
                                        <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                            {dosha.recommendedWhen.slice(0, 2).map((item, i) => (
                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Location Tags */}
                                {dosha.locationOptions && dosha.locationOptions.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {dosha.locationOptions.slice(0, 2).map((loc, i) => (
                                            <span key={i} style={{
                                                background: '#E8F5E9',
                                                color: '#2E7D32',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem'
                                            }}>{loc}</span>
                                        ))}
                                        {dosha.locationOptions.length > 2 && (
                                            <span
                                                onClick={() => setShowLocationsModal(dosha)}
                                                style={{
                                                    background: '#F3F4F6',
                                                    color: 'var(--primary)',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                    fontWeight: '500'
                                                }}
                                            >+{dosha.locationOptions.length - 2} more</span>
                                        )}
                                    </div>
                                )}

                                {/* Price & CTA */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Starting from</div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.25rem' }}>
                                            {formatPrice(dosha.price)}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        onClick={() => navigate(`/doshas/${dosha.slug}`)}
                                    >
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Locations Modal */}
            {showLocationsModal && (
                <div
                    onClick={() => setShowLocationsModal(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            maxWidth: '400px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Available Locations</h3>
                            <button
                                onClick={() => setShowLocationsModal(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                            {showLocationsModal.name} can be performed at these locations:
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {showLocationsModal.locationOptions.map((loc, i) => (
                                <span key={i} style={{
                                    background: '#E8F5E9',
                                    color: '#2E7D32',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem'
                                }}>{loc}</span>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem' }}
                            onClick={() => {
                                setShowLocationsModal(null);
                                navigate(`/doshas/${showLocationsModal.slug}`);
                            }}
                        >
                            View {showLocationsModal.name}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoshasPage;
