import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Clock, MapPin, CheckCircle, ArrowRight, Star, PlayCircle } from 'lucide-react';

const CeremonyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState({
        date: '', time: '', address: ''
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/ceremonies/${id}?lang=${language}`);
                setDetails(res.data);
            } catch (error) {
                console.error('Error fetching ceremony details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, language]);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            const bookingData = {
                ceremonyType: details.title,
                ...bookingDetails,
                amount: 1000
            };
            localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${apiUrl}/api/bookings`, {
                ceremonyType: details.title,
                date: bookingDetails.date,
                time: bookingDetails.time,
                address: bookingDetails.address,
                amount: 1000
            });

            const booking = res.data;

            navigate('/dashboard', {
                state: {
                    bookingSuccess: true,
                    message: 'Booking request sent successfully! Please complete the advance payment to confirm your slot.',
                    initiatePayment: true,
                    bookingId: booking.id,
                    advanceAmount: booking.advanceAmount
                }
            });
        } catch (err) {
            console.error('Error creating booking:', err);
            setError(err.response?.data?.error || 'Error booking ceremony. Please try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!details) return <div>Ceremony not found</div>;

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            {/* Inline Error Banner */}
            {error && (
                <div style={{
                    backgroundColor: '#FEE2E2', border: '1px solid #EF4444', color: '#991B1B',
                    padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <span>❌</span>
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>

                {/* Left Column: Details */}
                <div>
                    <img
                        src={details.image}
                        alt={details.title}
                        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '2rem' }}
                    />
                    <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{details.title}</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        {details.description}
                    </p>

                    {/* Videos Carousel (Simple) */}
                    {details.videos && details.videos.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <PlayCircle size={20} color="var(--primary)" /> Ceremony Videos
                            </h3>
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                {details.videos.map((video, i) => (
                                    <video key={i} controls style={{ width: '300px', borderRadius: 'var(--radius)' }}>
                                        <source src={video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={20} color="var(--primary)" /> Required Samagri
                        </h3>
                        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', listStyle: 'none' }}>
                            {details.samagri.map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowRight size={20} color="var(--primary)" /> Ceremony Process
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {details.process.map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#FFFBEB', padding: '1rem', borderRadius: 'var(--radius)' }}>
                                    <div style={{
                                        width: '30px', height: '30px', background: 'var(--primary)', color: 'white',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                    }}>
                                        {i + 1}
                                    </div>
                                    <span style={{ fontWeight: '500' }}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    {details.reviews && details.reviews.length > 0 && (
                        <div>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Star size={20} color="var(--primary)" /> Reviews
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {details.reviews.map((review, i) => (
                                    <div key={i} className="card" style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold' }}>{review.user}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', color: '#F59E0B' }}>
                                                {review.rating} <Star size={14} fill="#F59E0B" />
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Booking Form */}
                <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: '2px solid var(--primary)' }}>
                        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Book This Ceremony</h2>

                        <form onSubmit={handleBookingSubmit}>
                            <label className="label">Your Name</label>
                            <div className="input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                                <input
                                    type="text"
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                                    placeholder="Enter your name"
                                    value={bookingDetails.name || ''}
                                    onChange={e => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                                />
                            </div>

                            <label className="label">Phone Number</label>
                            <div className="input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                                <input
                                    type="tel"
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                                    placeholder="Enter phone number"
                                    value={bookingDetails.phone || ''}
                                    onChange={e => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                                />
                            </div>

                            <label className="label">Preferred Date</label>
                            <div className="input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                                <Calendar size={18} color="var(--text-light)" />
                                <input
                                    type="date"
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                                    value={bookingDetails.date}
                                    onChange={e => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                                />
                            </div>

                            <label className="label">Preferred Time</label>
                            <div className="input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                                <Clock size={18} color="var(--text-light)" />
                                <input
                                    type="time"
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                                    value={bookingDetails.time}
                                    onChange={e => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                                />
                            </div>

                            <label className="label">Address</label>
                            <div className="input" style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', padding: '0.5rem' }}>
                                <MapPin size={18} color="var(--text-light)" style={{ marginTop: '3px' }} />
                                <textarea
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', fontFamily: 'inherit', resize: 'none' }}
                                    rows="3"
                                    placeholder="Enter full address"
                                    value={bookingDetails.address}
                                    onChange={e => setBookingDetails({ ...bookingDetails, address: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1rem', fontSize: '1rem' }}
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : user ? 'Proceed to Book' : 'Login to Book'}
                            </button>
                        </form>

                        {/* Consult Astrologer Section */}
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                            borderRadius: '0.5rem',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
                                🌟 Not sure about the best date & time?
                            </p>
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                                    color: 'white',
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontSize: '0.9rem',
                                    border: 'none',
                                    borderRadius: '0.4rem',
                                    cursor: 'pointer'
                                }}
                                onClick={() => window.open('https://wa.me/917993322387?text=Hi, I need help finding the best Muhurat for ' + encodeURIComponent(details?.title || 'my ceremony'), '_blank')}
                            >
                                🔮 Consult Astrologer for Best Muhurat
                            </button>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                                Our expert will suggest auspicious dates
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CeremonyDetails;
