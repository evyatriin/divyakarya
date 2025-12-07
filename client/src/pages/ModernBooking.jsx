import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const ModernBooking = () => {
    const navigate = useNavigate();
    const { language, changeLanguage } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState('');

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
        preferredLanguage: '',
        customerName: '',
        customerEmail: '',
        customerPhone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/bookings/public`, {
                ceremonyType: formData.ceremony,
                date: formData.date,
                time: formData.time,
                city: formData.city,
                locationType: formData.locationType,
                tradition: formData.tradition,
                purpose: formData.purpose,
                participants: formData.participants,
                havanOption: formData.havan,
                samagriOption: formData.samagri,
                preferredLanguage: formData.preferredLanguage,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone
            });

            if (response.data.success) {
                setBookingDetails(response.data.booking);
                setShowSuccess(true);
            }
        } catch (err) {
            console.error('Booking submission error:', err);
            setError(err.response?.data?.error || 'Failed to submit booking. Please try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
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

    if (showSuccess) {
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
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.7) 0%, rgba(0, 0, 0, 0.8) 100%)',
                    zIndex: 1
                }}></div>

                <div className="animate-fade-in" style={{
                    position: 'relative',
                    zIndex: 2,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 251, 235, 0.98) 100%)',
                    padding: '3.5rem',
                    borderRadius: '20px',
                    maxWidth: '600px',
                    width: '100%',
                    boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                    <h1 style={{
                        background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '1.5rem',
                        fontFamily: '"Playfair Display", "Georgia", serif',
                        fontSize: '2.5rem',
                        fontWeight: '700'
                    }}>
                        Booking Confirmed!
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#1F2937',
                        marginBottom: '2rem',
                        lineHeight: '1.8'
                    }}>
                        Thank you for your booking request. We have received your details and will get back to you as soon as possible.
                    </p>

                    <div style={{
                        background: 'rgba(217, 119, 6, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        textAlign: 'left'
                    }}>
                        <h3 style={{ color: '#D97706', marginBottom: '1rem' }}>Booking Details</h3>
                        <p style={{ margin: '0.5rem 0' }}><strong>Ceremony:</strong> {bookingDetails?.ceremonyType}</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Date:</strong> {bookingDetails?.date}</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Time:</strong> {bookingDetails?.time}</p>
                        <p style={{ margin: '0.5rem 0' }}><strong>Status:</strong> <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>Pending</span></p>
                    </div>

                    <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: '2rem' }}>
                        📧 A confirmation email has been sent to <strong>{formData.customerEmail}</strong>
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 2.5rem',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 8px 25px rgba(217, 119, 6, 0.35)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

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
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.7) 0%, rgba(0, 0, 0, 0.8) 100%)',
                zIndex: 1
            }}></div>

            {/* Inline Error Banner */}
            {error && (
                <div style={{
                    position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
                    backgroundColor: '#FEE2E2', border: '1px solid #EF4444', color: '#991B1B',
                    padding: '1rem 2rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <span>❌</span>
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B' }}>✕</button>
                </div>
            )}

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
                    <select name="city" value={formData.city} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Select City</option>
                        {cities.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    to perform
                    <select name="ceremony" value={formData.ceremony} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Select Ceremony</option>
                        {ceremonies.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    on
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required className="modern-input" />
                    at
                    <select name="time" value={formData.time} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Select Time</option>
                        {times.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    in
                    <select name="locationType" value={formData.locationType} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Select Location</option>
                        {locations.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , as per
                    <select name="tradition" value={formData.tradition} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Select Tradition</option>
                        {traditions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , for
                    <select name="purpose" value={formData.purpose} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Select Purpose</option>
                        {purposes.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , with
                    <select name="participants" value={formData.participants} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Select Count</option>
                        {participantCounts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    participants, including
                    <select name="havan" value={formData.havan} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Havan Option</option>
                        {havanOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , requiring
                    <select name="samagri" value={formData.samagri} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Samagri Option</option>
                        {samagriOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    , and preferring a Pandit who speaks
                    <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} required className="modern-select">
                        <option value="" disabled>Select Language</option>
                        {languages.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    .

                    <div style={{
                        marginTop: '3rem',
                        padding: '2rem',
                        background: 'rgba(217, 119, 6, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(217, 119, 6, 0.2)'
                    }}>
                        <h3 style={{
                            color: '#D97706',
                            marginBottom: '1.5rem',
                            fontSize: '1.5rem',
                            fontFamily: '"Playfair Display", serif'
                        }}>
                            Your Contact Information
                        </h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <input
                                type="text"
                                name="customerName"
                                placeholder="Full Name"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                                className="contact-input"
                            />
                            <input
                                type="email"
                                name="customerEmail"
                                placeholder="Email Address"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                required
                                className="contact-input"
                            />
                            <input
                                type="tel"
                                name="customerPhone"
                                placeholder="Phone Number"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                required
                                className="contact-input"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{
                            fontSize: '1.25rem',
                            padding: '1.1rem 3.5rem',
                            borderRadius: '50px',
                            background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            boxShadow: '0 8px 25px rgba(217, 119, 6, 0.35)',
                            transition: 'all 0.3s ease',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}>
                            {loading ? 'Submitting...' : 'Find My Pandit'}
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
                
                .contact-input {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid rgba(217, 119, 6, 0.3);
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.3s ease;
                    background: white;
                }
                
                .contact-input:focus {
                    outline: none;
                    border-color: #D97706;
                    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
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
                
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(217, 119, 6, 0.45) !important;
                }
                
                .btn-primary:active:not(:disabled) {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default ModernBooking;
