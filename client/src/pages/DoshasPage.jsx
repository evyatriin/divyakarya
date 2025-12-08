import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DoshasPage = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [doshas, setDoshas] = useState([]);
    const [loading, setLoading] = useState(true);

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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {doshas.map((dosha) => (
                            <div key={dosha.id} className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2rem' }}>{dosha.icon}</span>
                                    <h3 style={{ margin: 0 }}>{dosha.name}</h3>
                                </div>
                                <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                    {dosha.details || dosha.description}
                                </p>
                                {dosha.remedies && dosha.remedies.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <strong style={{ fontSize: '0.85rem' }}>Remedies:</strong>
                                        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                            {dosha.remedies.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                    <span><Calendar size={14} style={{ marginRight: '0.25rem' }} />{dosha.duration}</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{formatPrice(dosha.price)}</span>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Book Consultation
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section style={{ background: 'var(--secondary)', color: 'white', padding: '3rem 1rem', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '1rem' }}>Not Sure Which Dosha You Have?</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
                        Get a free consultation with our expert astrologers to identify doshas in your horoscope.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/contact')}>
                        Get Free Consultation
                    </button>
                </div>
            </section>
        </div>
    );
};

export default DoshasPage;
