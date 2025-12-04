import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ModernBooking = () => {
    const navigate = useNavigate();
    const { language, changeLanguage } = useLanguage();

    const [formData, setFormData] = useState({
        city: '',
        ceremony: '',
        date: '',
        time: '',
        locationType: '',
        tradition: '',
        purpose: '',
        participants: '',
        havan: '',
        samagri: '',
        preferredLanguage: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const bookingData = {
            ceremonyType: formData.ceremony,
            date: formData.date,
            time: formData.time,
            address: `${formData.locationType} in ${formData.city}`,
            notes: `Tradition: ${formData.tradition}, Purpose: ${formData.purpose}, Participants: ${formData.participants}, Havan: ${formData.havan}, Samagri: ${formData.samagri}, Language: ${formData.preferredLanguage}`
        };

        const user = localStorage.getItem('user');
        if (user) {
            navigate('/dashboard', { state: { prefill: bookingData } });
        } else {
            localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
            navigate('/login');
        }
    };

    const cities = ['Bengaluru', 'Hyderabad', 'Chennai', 'Mumbai', 'Delhi', 'Pune'];
    const ceremonies = ['Satyanarayan Puja', 'Griha Pravesh', 'Ganapathi Puja', 'Namkaran', 'Navagraha Homam', 'Vivah Puja'];
    const times = ['Morning (6 AM - 9 AM)', 'Late Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)'];
    const locations = ['Home', 'Apartment', 'Office', 'Temple', 'Function Hall'];
    const traditions = ['North Indian', 'South Indian (Telugu)', 'South Indian (Tamil)', 'South Indian (Kannada)', 'Bengali', 'Maharashtrian', 'Gujarati'];
    const purposes = ['Housewarming', 'Birthday', 'Childbirth', 'Peace/Harmony', 'Festival', 'Astrological Remedy', 'Wedding'];
    const participantCounts = ['1-2', '3-5', '5-10', '10-20', '20+'];
    const havanOptions = ['Yes, include Havan', 'No Havan', 'As per tradition'];
    const samagriOptions = ['Pandit brings all samagri', 'I will arrange samagri', 'Shared responsibility'];
    const languages = ['Hindi', 'Telugu', 'Tamil', 'Kannada', 'English', 'Marathi', 'Bengali'];

    const bgImage = "https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=2000&auto=format&fit=crop";

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            {/* Overlay with gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.7) 0%, rgba(0, 0, 0, 0.8) 100%)',
                zIndex: 1
            }}></div>

            {/* Language Switcher */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                zIndex: 10,
                display: 'flex',
                gap: '0.75rem'
            }}>
                {['en', 'te', 'ta', 'hi'].map(lang => (
                    <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        style={{
                            background: language === lang
                                ? 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)'
                                : 'rgba(255, 255, 255, 0.15)',
                            color: 'white',
                            border: language === lang ? 'none' : '1.5px solid rgba(255, 255, 255, 0.3)',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            boxShadow: language === lang ? '0 4px 15px rgba(217, 119, 6, 0.4)' : 'none'
                        }}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="animate-fade-in" style={{
                position: 'relative',
                zIndex: 2,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 251, 235, 0.98) 100%)',
                padding: '3.5rem',
                borderRadius: '20px',
                maxWidth: '1100px',
                width: '100%',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(217, 119, 6, 0.1)'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '2.5rem',
                    fontFamily: '"Playfair Display", "Georgia", serif',
                    fontSize: '3rem',
                    fontWeight: '700',
                    letterSpacing: '-0.5px'
                }}>
                    Plan Your Divine Ceremony
                </h1>

                <form onSubmit={handleSubmit} style={{
                    fontSize: '1.35rem',
                    lineHeight: '2.8',
                    color: '#1F2937',
                    textAlign: 'left',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontWeight: '400'
                }}>
                    I need a Pandit in
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Select City</option>
                        {cities.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    to perform
                    <select
                        name="ceremony"
                        value={formData.ceremony}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Select Ceremony</option>
                        {ceremonies.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    on
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="modern-input"
                    />
                    at
                    <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Select Time</option>
                        {times.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    in
                    <select
                        name="locationType"
                        value={formData.locationType}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Select Location</option>
                        {locations.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , as per
                    <select
                        name="tradition"
                        value={formData.tradition}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Select Tradition</option>
                        {traditions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , for
                    <select
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Select Purpose</option>
                        {purposes.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , with
                    <select
                        name="participants"
                        value={formData.participants}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Select Count</option>
                        {participantCounts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    participants, including
                    <select
                        name="havan"
                        value={formData.havan}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Havan Option</option>
                        {havanOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , requiring
                    <select
                        name="samagri"
                        value={formData.samagri}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Samagri Option</option>
                        {samagriOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , and preferring a Pandit who speaks
                    <select
                        name="preferredLanguage"
                        value={formData.preferredLanguage}
                        onChange={handleChange}
                        required
                        className="modern-select"
                    >
                        <option value="" disabled>Select Language</option>
                        {languages.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    .

                    <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
                        <button type="submit" className="btn btn-primary" style={{
                            fontSize: '1.25rem',
                            padding: '1.1rem 3.5rem',
                            borderRadius: '50px',
                            background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            boxShadow: '0 8px 25px rgba(217, 119, 6, 0.35)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}>
                            Find My Pandit
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
                
                .modern-select, .modern-input {
                    border: none;
                    border-bottom: 2.5px solid #D97706;
                    background: linear-gradient(to bottom, transparent 0%, rgba(251, 191, 36, 0.08) 100%);
                    font-size: 1.35rem;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    color: #D97706;
                    padding: 0.3rem 0.7rem;
                    margin: 0 0.4rem;
                    outline: none;
                    cursor: pointer;
                    font-weight: 600;
                    max-width: 280px;
                    transition: all 0.3s ease;
                    border-radius: 4px 4px 0 0;
                }
                
                .modern-select:hover, .modern-input:hover {
                    background: linear-gradient(to bottom, rgba(251, 191, 36, 0.08) 0%, rgba(251, 191, 36, 0.15) 100%);
                    border-bottom-color: #F59E0B;
                }
                
                .modern-select:focus, .modern-input:focus {
                    background: linear-gradient(to bottom, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.2) 100%);
                    border-bottom-color: #FBBF24;
                    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
                }
                
                .modern-select option {
                    background: white;
                    color: #1F2937;
                    padding: 0.5rem;
                }
                
                input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    filter: opacity(0.6);
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(217, 119, 6, 0.45) !important;
                }
                
                .btn-primary:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default ModernBooking;
