import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Clock, CheckCircle, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DoshaDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [dosha, setDosha] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState('basic');
    const [expandedFaq, setExpandedFaq] = useState(null);

    useEffect(() => {
        const fetchDosha = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/doshas/${slug}?lang=${language}`);
                setDosha(res.data);
            } catch (error) {
                console.error('Error fetching dosha:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDosha();
    }, [slug, language]);

    const formatPrice = (price) => `₹${price?.toLocaleString('en-IN')}`;

    if (loading) return <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>Loading...</div>;
    if (!dosha) return <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>Dosha not found</div>;

    const tiers = dosha.pricingTiers || {};

    return (
        <div className="animate-fade-in" style={{ background: 'var(--background)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
                padding: '2rem 1rem'
            }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '3rem' }}>{dosha.icon}</span>
                        <h1 style={{ color: 'var(--secondary)', margin: 0 }}>{dosha.name}</h1>
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1rem' }}>
                        {dosha.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        <span><Clock size={16} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />{dosha.duration}</span>
                        <span><MapPin size={16} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />{dosha.mode}</span>
                    </div>
                </div>
            </section>

            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Recommended When */}
                {dosha.recommendedWhen && dosha.recommendedWhen.length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Recommended When</h3>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                            {dosha.recommendedWhen.map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Who Performs & Locations */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="card">
                        <h4 style={{ marginBottom: '0.75rem', color: 'var(--secondary)' }}><Users size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Who Performs</h4>
                        <p style={{ margin: 0, color: 'var(--text-light)' }}>{dosha.whoPerforms}</p>
                    </div>
                    {dosha.locationOptions && dosha.locationOptions.length > 0 && (
                        <div className="card">
                            <h4 style={{ marginBottom: '0.75rem', color: 'var(--secondary)' }}><MapPin size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Location Options</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {dosha.locationOptions.map((loc, i) => (
                                    <span key={i} style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>{loc}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* What is this Dosha */}
                {dosha.whatIsDosha && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>What is {dosha.name.split(' ')[0]} Dosha?</h3>
                        <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.7' }}>{dosha.whatIsDosha}</p>
                    </div>
                )}

                {/* Why this Puja */}
                {dosha.whyPuja && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Why This Puja is Done</h3>
                        <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.7' }}>{dosha.whyPuja}</p>
                    </div>
                )}

                {/* What Will Be Done */}
                {dosha.whatWillBeDone && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>What Exactly Will Be Done</h3>
                        <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.7' }}>{dosha.whatWillBeDone}</p>
                    </div>
                )}

                {/* Inclusions */}
                {dosha.inclusions && dosha.inclusions.length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>What's Included</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                            {dosha.inclusions.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} color="#10B981" />
                                    <span style={{ color: 'var(--text)' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* What You Receive */}
                {dosha.whatYouReceive && dosha.whatYouReceive.length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>What You Will Receive</h3>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                            {dosha.whatYouReceive.map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Pricing Tiers */}
                {Object.keys(tiers).length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Choose Your Package</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            {Object.entries(tiers).map(([key, tier]) => (
                                <div
                                    key={key}
                                    onClick={() => setSelectedTier(key)}
                                    style={{
                                        border: selectedTier === key ? '2px solid var(--primary)' : '1px solid #E5E7EB',
                                        borderRadius: '12px',
                                        padding: '1.25rem',
                                        cursor: 'pointer',
                                        background: selectedTier === key ? 'rgba(255, 107, 53, 0.05)' : 'white',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{tier.label}</span>
                                        {key === 'standard' && <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Popular</span>}
                                    </div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                                        {formatPrice(tier.price)}
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                        {tier.features?.map((f, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{f}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Important Days */}
                {dosha.importantDays && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}><Calendar size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Best Days to Perform</h3>
                        <p style={{ margin: 0, color: 'var(--text)' }}>{dosha.importantDays}</p>
                        {dosha.availableDates && (
                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                <strong>Available:</strong> {dosha.availableDates}
                            </p>
                        )}
                    </div>
                )}

                {/* Preparation & Samagri */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {dosha.samagri && (
                        <div className="card">
                            <h4 style={{ marginBottom: '0.75rem', color: 'var(--secondary)' }}>Samagri & Arrangements</h4>
                            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>{dosha.samagri}</p>
                        </div>
                    )}
                    {dosha.preparation && (
                        <div className="card">
                            <h4 style={{ marginBottom: '0.75rem', color: 'var(--secondary)' }}>Preparation for Devotee</h4>
                            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>{dosha.preparation}</p>
                        </div>
                    )}
                </div>

                {/* FAQs */}
                {dosha.faqs && dosha.faqs.length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Frequently Asked Questions</h3>
                        {dosha.faqs.map((faq, i) => (
                            <div key={i} style={{ borderBottom: i < dosha.faqs.length - 1 ? '1px solid #E5E7EB' : 'none', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                                <div
                                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    <strong style={{ color: 'var(--text)' }}>{faq.question}</strong>
                                    {expandedFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                                {expandedFaq === i && (
                                    <p style={{ margin: '0.5rem 0 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div style={{ position: 'sticky', bottom: '1rem', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{tiers[selectedTier]?.label || 'Basic'} Package</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {formatPrice(tiers[selectedTier]?.price || dosha.price)}
                        </div>
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                        onClick={() => navigate(`/doshas/${slug}/book?tier=${selectedTier}`)}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoshaDetailPage;
