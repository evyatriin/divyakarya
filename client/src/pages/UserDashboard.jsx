import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, CreditCard, Download, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserDashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [ceremonies, setCeremonies] = useState([]);
    const [newBooking, setNewBooking] = useState({
        ceremonyType: '', date: '', time: '', address: '', amount: 1000
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookings();
        fetchCeremonies();
        checkForPendingBooking();
    }, []);

    const fetchCeremonies = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/ceremonies`);
            setCeremonies(res.data);
        } catch (error) {
            console.error('Error fetching ceremonies:', error);
        }
    };

    const checkForPendingBooking = async () => {
        // Check if redirected from ceremony page with booking data
        if (location.state?.prefill) {
            const bookingData = location.state.prefill;
            setNewBooking(bookingData);

            // Auto-submit the booking if all required fields are present
            if (bookingData.ceremonyType && bookingData.date && bookingData.time && bookingData.address) {
                await autoSubmitBooking(bookingData);
            }
            // Clear the state to prevent re-submission on page refresh
            window.history.replaceState({}, document.title);
            return;
        }

        // Check localStorage for pending booking (from login redirect)
        const pending = localStorage.getItem('pendingBooking');
        if (pending) {
            try {
                const data = JSON.parse(pending);
                setNewBooking(data);
                localStorage.removeItem('pendingBooking');
                if (data.ceremonyType && data.date && data.time && data.address) {
                    await autoSubmitBooking(data);
                }
            } catch (e) {
                console.error("Error parsing pending booking", e);
            }
        }
    };

    const [successMessage, setSuccessMessage] = useState(null);

    const autoSubmitBooking = async (bookingData) => {
        setSubmitting(true);
        setError('');
        setSuccessMessage(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${apiUrl}/api/bookings`, bookingData);
            await fetchBookings();
            setNewBooking({ ceremonyType: '', date: '', time: '', address: '', amount: 1000 });
            setSuccessMessage({
                id: res.data.id,
                message: `Booking request sent successfully! Request #${res.data.id}`
            });
            // Clear success message after 10 seconds
            setTimeout(() => setSuccessMessage(null), 10000);
        } catch (error) {
            console.error('Error creating booking:', error);
            setError(error.response?.data?.error || 'Error booking ceremony');
        } finally {
            setSubmitting(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${apiUrl}/api/bookings`);
            setBookings(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMessage(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${apiUrl}/api/bookings`, newBooking);
            await fetchBookings();
            setNewBooking({ ceremonyType: '', date: '', time: '', address: '', amount: 1000 });
            setSuccessMessage({
                id: res.data.id,
                message: `Booking request sent successfully! Request #${res.data.id}`
            });
            // Clear success message after 10 seconds
            setTimeout(() => setSuccessMessage(null), 10000);
        } catch (error) {
            console.error('Error creating booking:', error);
            const errorMsg = error.response?.data?.error || 'Error booking ceremony';
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePayment = async (bookingId, amount) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const orderRes = await axios.post(`${apiUrl}/api/payments/create-order`, { amount, bookingId });
            const options = {
                key: 'rzp_test_123456',
                amount: orderRes.data.amount,
                currency: "INR",
                name: "DivyaKarya",
                description: "Ceremony Booking",
                order_id: orderRes.data.id,
                handler: async function (response) {
                    try {
                        await axios.post(`${apiUrl}/api/payments/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId
                        });
                        fetchBookings();
                        alert('Payment Successful!');
                    } catch (err) {
                        console.error('Payment verification failed:', err);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: async function () {
                        console.log('Payment cancelled by user');
                        try {
                            await axios.post(`${apiUrl}/api/payments/failure`, {
                                bookingId,
                                errorDescription: 'Payment cancelled by user (modal closed)',
                                razorpayOrderId: orderRes.data.id
                            });
                            fetchBookings(); // Refresh to show failed status if we update it
                        } catch (err) {
                            console.error('Error reporting payment cancellation:', err);
                        }
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email || '',
                    contact: user.phone || ''
                },
                theme: { color: "#D97706" }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', async function (response) {
                console.error('Payment failed:', response.error);
                try {
                    await axios.post(`${apiUrl}/api/payments/failure`, {
                        bookingId,
                        errorDescription: response.error.description || 'Payment failed',
                        razorpayOrderId: orderRes.data.id
                    });
                    fetchBookings();
                    alert(`Payment Failed: ${response.error.description}`);
                } catch (err) {
                    console.error('Error reporting payment failure:', err);
                }
            });
            rzp1.open();
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment initiation failed. Please try again.');
        }
    };

    const generateInvoice = (booking) => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(217, 119, 6);
        doc.text('DivyaKarya', 20, 20);

        doc.setFontSize(16);
        doc.text('INVOICE', 20, 35);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Invoice #: ${booking.id}`, 20, 45);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);

        doc.setFontSize(12);
        doc.text('Bill To:', 20, 65);
        doc.setFontSize(10);
        doc.text(user.name, 20, 72);
        doc.text(user.phone || '', 20, 79);
        doc.text(user.email || '', 20, 86);

        doc.autoTable({
            startY: 100,
            head: [['Description', 'Date', 'Time', 'Amount']],
            body: [[
                booking.ceremonyType,
                booking.date,
                booking.time,
                `₹${booking.amount}`
            ]],
            theme: 'grid',
            headStyles: { fillColor: [217, 119, 6] }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.text(`Location: ${booking.address || booking.city}`, 20, finalY);
        if (booking.Pandit) {
            doc.text(`Pandit: ${booking.Pandit.name}`, 20, finalY + 7);
        }
        doc.text(`Status: ${booking.status.toUpperCase()}`, 20, finalY + 14);
        doc.text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`, 20, finalY + 21);

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: ₹${booking.amount}`, 140, finalY + 35);

        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Thank you for choosing DivyaKarya!', 20, 280);
        doc.text('For any queries, contact us at support@divyakarya.com', 20, 285);

        doc.save(`invoice-${booking.id}.pdf`);
    };

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Namaste, {user.name}</h1>

            {/* Booking Form Section */}
            <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Book a Ceremony</h3>
                    {successMessage && (
                        <div style={{
                            background: '#D1FAE5',
                            color: '#065F46',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            border: '1px solid #34D399'
                        }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Success!</div>
                            {successMessage.message}
                        </div>
                    )}
                    {error && (
                        <div style={{
                            background: '#FEE2E2',
                            color: '#991B1B',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleBook}>
                        <label className="label">Ceremony Type</label>
                        <select
                            className="input"
                            value={newBooking.ceremonyType}
                            onChange={e => setNewBooking({ ...newBooking, ceremonyType: e.target.value })}
                            required
                        >
                            <option value="">Select Ceremony</option>
                            {ceremonies.map(c => (
                                <option key={c.id} value={c.title}>{c.title}</option>
                            ))}
                        </select>

                        <label className="label">Date</label>
                        <input type="date" className="input" required value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} />

                        <label className="label">Time</label>
                        <input type="time" className="input" required value={newBooking.time} onChange={e => setNewBooking({ ...newBooking, time: e.target.value })} />

                        <label className="label">Address</label>
                        <textarea
                            className="input"
                            required
                            value={newBooking.address}
                            onChange={e => setNewBooking({ ...newBooking, address: e.target.value })}
                            placeholder="Enter your full address"
                            rows="3"
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Request Pandit'}
                        </button>
                    </form>
                </div>

                {/* Booking History */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem' }}>Your Booking History ({bookings.length})</h3>
                    {bookings.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <Calendar size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
                            <p style={{ color: 'var(--text-light)' }}>No bookings yet. Create your first booking!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {bookings.map(b => (
                                <div key={b.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{b.ceremonyType}</h4>
                                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-light)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={14} /> {b.date}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Clock size={14} /> {b.time}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <MapPin size={14} /> {b.city || b.address}
                                                </span>
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            background: b.status === 'accepted' ? '#D1FAE5' :
                                                b.status === 'completed' ? '#DBEAFE' :
                                                    b.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                                            color: b.status === 'accepted' ? '#065F46' :
                                                b.status === 'completed' ? '#1E40AF' :
                                                    b.status === 'rejected' ? '#991B1B' : '#92400E'
                                        }}>
                                            {b.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {b.Pandit && (
                                        <div style={{
                                            padding: '0.75rem',
                                            background: '#F9FAFB',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Assigned Pandit</div>
                                            <div style={{ fontWeight: '600' }}>{b.Pandit.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{b.Pandit.phone}</div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Amount</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                ₹{b.amount || 0}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                                Payment: <span style={{
                                                    fontWeight: '600',
                                                    color: b.paymentStatus === 'paid' ? '#10B981' : '#F59E0B'
                                                }}>
                                                    {b.paymentStatus.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            {b.status === 'accepted' && b.paymentStatus === 'pending' && (
                                                <button
                                                    onClick={() => handlePayment(b.id, b.amount)}
                                                    className="btn btn-primary"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <CreditCard size={16} /> Pay Now
                                                </button>
                                            )}
                                            {b.paymentStatus === 'paid' && (
                                                <button
                                                    onClick={() => generateInvoice(b)}
                                                    className="btn btn-outline"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <Download size={16} /> Invoice
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Available Ceremonies Section */}
            <div>
                <h3 style={{ marginBottom: '1.5rem', borderTop: '1px solid #E5E7EB', paddingTop: '2rem' }}>
                    Available Ceremonies
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {ceremonies.map(ceremony => (
                        <div
                            key={ceremony.id}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onClick={() => navigate(`/ceremony/${ceremony.slug}`)}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{ceremony.icon}</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>{ceremony.title}</h4>
                            <p style={{
                                color: 'var(--text-light)',
                                fontSize: '0.9rem',
                                marginBottom: '1rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {ceremony.description}
                            </p>
                            <button
                                className="btn btn-outline"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                View Details <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
