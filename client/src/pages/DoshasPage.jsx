import { useNavigate } from 'react-router-dom';
import { Shield, Star, Calendar } from 'lucide-react';

const DoshasPage = () => {
    const navigate = useNavigate();

    const doshas = [
        {
            name: 'Manglik Dosha',
            icon: '🔴',
            description: 'Mars affliction in horoscope affecting marriage and relationships',
            details: 'Manglik Dosha occurs when Mars is placed in 1st, 2nd, 4th, 7th, 8th, or 12th house. It can cause delays in marriage and relationship challenges.',
            remedies: ['Mangal Shanti Puja', 'Kumbh Vivah', 'Hanuman Chalisa recitation'],
            duration: '2-3 hours',
            price: '₹2,100'
        },
        {
            name: 'Kaal Sarp Dosha',
            icon: '🐍',
            description: 'All planets hemmed between Rahu and Ketu causing life obstacles',
            details: 'This dosha occurs when all seven planets are positioned between Rahu and Ketu. It can bring unexpected challenges and delays in life.',
            remedies: ['Kaal Sarp Shanti Puja', 'Naag Puja at Trimbakeshwar', 'Rahu-Ketu Shanti'],
            duration: '3-4 hours',
            price: '₹3,500'
        },
        {
            name: 'Pitra Dosha',
            icon: '🙏',
            description: 'Ancestral karma affecting current life prosperity and peace',
            details: 'Pitra Dosha arises from unfulfilled wishes or wrongdoings of ancestors. It can affect health, finances, and family harmony.',
            remedies: ['Pitra Tarpan', 'Shradh Ceremonies', 'Pinda Daan at Gaya'],
            duration: '1-2 hours',
            price: '₹1,500'
        },
        {
            name: 'Shani Dosha',
            icon: '⚫',
            description: 'Saturn affliction causing hardships, delays, and obstacles',
            details: 'Shani Dosha occurs during Sade Sati, Shani Dhaiya, or malefic Saturn placement. It tests patience and brings life lessons.',
            remedies: ['Shani Shanti Puja', 'Til Tel Abhishek', 'Hanuman Puja on Saturdays'],
            duration: '2-3 hours',
            price: '₹2,500'
        },
        {
            name: 'Grahan Dosha',
            icon: '🌑',
            description: 'Birth during eclipse causing health and mental challenges',
            details: 'If born during a solar or lunar eclipse, this dosha can affect mental peace and overall wellbeing.',
            remedies: ['Grahan Dosha Shanti', 'Mahamrityunjaya Japa', 'Surya/Chandra Puja'],
            duration: '2-3 hours',
            price: '₹2,000'
        },
        {
            name: 'Nadi Dosha',
            icon: '💫',
            description: 'Matching issue in Kundli affecting marriage compatibility',
            details: 'Nadi Dosha in Kundli matching can indicate health issues for offspring and compatibility challenges.',
            remedies: ['Nadi Dosha Nivaran Puja', 'Maha Mrityunjaya Japa', 'Charitable activities'],
            duration: '2-3 hours',
            price: '₹2,100'
        }
    ];

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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {doshas.map((dosha, idx) => (
                        <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>{dosha.icon}</span>
                                <h3 style={{ margin: 0 }}>{dosha.name}</h3>
                            </div>
                            <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                {dosha.details}
                            </p>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ fontSize: '0.85rem' }}>Remedies:</strong>
                                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                    {dosha.remedies.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                <span><Calendar size={14} style={{ marginRight: '0.25rem' }} />{dosha.duration}</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{dosha.price}</span>
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
