import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Clock, MapPin, Users, Flame, ShoppingBag, Globe } from 'lucide-react';

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
        // Redirect to dashboard with prefilled data
        // Mapping fields to match what Dashboard/Booking might expect
        const bookingData = {
            ceremonyType: formData.ceremony,
            date: formData.date,
            time: formData.time,
            address: `${formData.locationType} in ${formData.city}`,
            notes: `Tradition: ${formData.tradition}, Purpose: ${formData.purpose}, Participants: ${formData.participants}, Havan: ${formData.havan}, Samagri: ${formData.samagri}, Language: ${formData.preferredLanguage}`
        };

        const user = localStorage.getItem('user'); // Simple check, ideally useAuth
        if (user) {
            navigate('/dashboard', { state: { prefill: bookingData } });
        } else {
            localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
            navigate('/login');
        }
    };

    // Options
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

    const bgImage = "https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=2000&auto=format&fit=crop"; // Traditional lamp/flower background

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
            {/* Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 1
            }}></div>

            {/* Language Switcher */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                zIndex: 10,
                display: 'flex',
                gap: '1rem'
            }}>
                {['en', 'te', 'ta', 'hi'].map(lang => (
                    <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        style={{
                            background: language === lang ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.4)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '3rem',
                borderRadius: '1rem',
                maxWidth: '1000px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: 'var(--primary)',
                    marginBottom: '2rem',
                    fontFamily: 'serif',
                    fontSize: '2.5rem'
                }}>
                    Plan Your Divine Ceremony
                </h1>

                <form onSubmit={handleSubmit} style={{
                    fontSize: '1.5rem',
                    lineHeight: '2.5',
                    color: '#333',
                    textAlign: 'justify'
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

                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <button type="submit" className="btn btn-primary" style={{
                            fontSize: '1.2rem',
                            padding: '1rem 3rem',
                            borderRadius: '50px',
                            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)'
                        }}>
                            Find My Pandit
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .modern-select, .modern-input {
                    border: none;
                    border-bottom: 2px solid var(--primary);
                    background: transparent;
                    font-size: 1.5rem;
                    font-family: inherit;
                    color: var(--primary);
                    padding: 0 0.5rem;
                    margin: 0 0.5rem;
                    outline: none;
                    cursor: pointer;
                    font-weight: bold;
                    max-width: 300px;
                }
                .modern-select:focus, .modern-input:focus {
                    background: rgba(249, 115, 22, 0.1);
                    border-radius: 4px;
                }
                /* Hide date picker icon slightly or style it */
                input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default ModernBooking;
