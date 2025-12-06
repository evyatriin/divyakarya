import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, CreditCard, Download, ArrowRight, XCircle, AlertCircle, Edit, User as UserIcon, Star } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserDashboard = () => {
    const { user, updateUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [ceremonies, setCeremonies] = useState([]);
    const [newBooking, setNewBooking] = useState({
        ceremonyType: '', date: '', time: '', address: ''
    });
    const [priceInfo, setPriceInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchBookings();
        fetchCeremonies();
        checkForPendingBooking();
    }, []);

    // Handle success message from navigation (e.g., after booking)
    useEffect(() => {
        if (location.state?.bookingSuccess) {
            setSuccessMessage({ message: location.state.message });

            // Auto-trigger payment if flag is present
            if (location.state.initiatePayment && location.state.bookingId && location.state.advanceAmount) {
                // Small delay to ensure UI renders
                setTimeout(() => {
                    handleAdvancePayment(location.state.bookingId, location.state.advanceAmount);
                }, 500);
            }

            // Clear state so it doesn't persist on refresh
            window.history.replaceState({}, document.title);
            // Auto-hide after 10 seconds
            setTimeout(() => setSuccessMessage(null), 10000);
        }
    }, [location]);

    // Fetch price when ceremony type changes
    useEffect(() => {
        if (newBooking.ceremonyType) {
            fetchCeremonyPrice(newBooking.ceremonyType);
        } else {
            setPriceInfo(null);
        }
    }, [newBooking.ceremonyType]);

    const fetchCeremonyPrice = async (ceremonyType) => {
        try {
            const res = await axios.get(`${apiUrl}/api/bookings/ceremony-price/${encodeURIComponent(ceremonyType)}`);
            setPriceInfo(res.data);
        } catch (error) {
            console.error('Error fetching price:', error);
        }
    };

    const fetchCeremonies = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/ceremonies`);
            setCeremonies(res.data);
        } catch (error) {
            console.error('Error fetching ceremonies:', error);
        }
    };

    const checkForPendingBooking = async () => {
        if (location.state?.prefill) {
            const bookingData = location.state.prefill;
            setNewBooking(bookingData);
            window.history.replaceState({}, document.title);
            return;
        }

        const pending = localStorage.getItem('pendingBooking');
        if (pending) {
            try {
                const data = JSON.parse(pending);
                setNewBooking(data);
                localStorage.removeItem('pendingBooking');
            } catch (e) {
                console.error("Error parsing pending booking", e);
            }
        }
    };

    const fetchBookings = async () => {
        try {
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
            // Step 1: Create booking
            const res = await axios.post(`${apiUrl}/api/bookings`, {
                ...newBooking,
                totalAmount: priceInfo?.totalAmount
            });

            const bookingData = res.data;

            // Step 2: Initiate advance payment
            await handleAdvancePayment(bookingData.id, bookingData.advanceAmount);

        } catch (error) {
            console.error('Error creating booking:', error);
            setError(error.response?.data?.error || 'Error booking ceremony');
            setSubmitting(false);
        }
    };

    const handleAdvancePayment = async (bookingId, advanceAmount) => {
        try {
            const orderRes = await axios.post(`${apiUrl}/api/payments/create-order`, {
                bookingId,
                paymentType: 'advance'
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_123456',
                amount: orderRes.data.amount,
                currency: "INR",
                name: "DivyaKarya",
                description: "25% Advance Payment",
                order_id: orderRes.data.id,
                handler: async function (response) {
                    try {
                        await axios.post(`${apiUrl}/api/payments/verify-advance`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId
                        });
                        await fetchBookings();
                        setNewBooking({ ceremonyType: '', date: '', time: '', address: '' });
                        setPriceInfo(null);
                        setSuccessMessage({
                            id: bookingId,
                            message: `Booking #${bookingId} confirmed! Advance payment of ₹${advanceAmount} received.`
                        });
                        setTimeout(() => setSuccessMessage(null), 10000);
                    } catch (err) {
                        console.error('Payment verification failed:', err);
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        setError('Payment was cancelled. Please complete payment to confirm booking.');
                        fetchBookings();
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email || '',
                    contact: user.phone || ''
                },
                theme: { color: "#D97706" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setError(`Payment Failed: ${response.error.description}`);
                axios.post(`${apiUrl}/api/payments/failure`, {
                    bookingId,
                    errorDescription: response.error.description
                });
            });
            rzp.open();
        } catch (error) {
            console.error('Payment initiation error:', error);
            setError('Failed to initiate payment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelBooking = async (booking) => {
        setCancellingId(booking.id);
        try {
            const res = await axios.put(`${apiUrl}/api/bookings/${booking.id}/cancel`, {
                reason: 'Cancelled by user'
            });

            // If refund is applicable, process it
            if (res.data.booking.refundAmount > 0) {
                try {
                    await axios.post(`${apiUrl}/api/payments/process-refund`, {
                        bookingId: booking.id
                    });
                } catch (refundError) {
                    console.error('Refund processing error:', refundError);
                    // Refund will be processed manually if automatic fails
                }
            }

            await fetchBookings();
            setShowCancelModal(null);
            setSuccessMessage({
                id: booking.id,
                message: res.data.message
            });
            setTimeout(() => setSuccessMessage(null), 10000);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setError(error.response?.data?.error || 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const getCancellationInfo = (booking) => {
        const ceremonyDate = new Date(`${booking.date}T${booking.time || '00:00'}`);
        const now = new Date();
        const hoursUntil = (ceremonyDate - now) / (1000 * 60 * 60);

        if (hoursUntil >= 24) {
            return {
                refundType: 'full',
                refundAmount: booking.advanceAmount,
                message: `Full refund of ₹${booking.advanceAmount} will be processed.`
            };
        } else {
            const partialRefund = Math.round(booking.advanceAmount * 0.5 * 100) / 100;
            return {
                refundType: 'partial',
                refundAmount: partialRefund,
                message: `Partial refund of ₹${partialRefund} (50%) will be processed. (Less than 24 hours before ceremony)`
            };
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${apiUrl}/api/users/profile`, profileForm);
            updateUser(res.data.user);
            setShowProfileModal(false);
            setSuccessMessage({ message: 'Profile updated successfully' });
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.errors?.[0]?.message || 'Failed to update profile');
        }
    };

    const openProfileModal = () => {
        setProfileForm({ name: user.name, phone: user.phone });
        setShowProfileModal(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/api/reviews`, {
                panditId: showReviewModal.Pandit.id,
                ceremonyType: showReviewModal.ceremonyType,
                rating: parseInt(reviewForm.rating),
                comment: reviewForm.comment
            });
            setSuccessMessage({ message: 'Review submitted successfully!' });
            setShowReviewModal(null);
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchBookings(); // Refresh to potentially update UI if we show "Reviewed" status
        } catch (error) {
            console.error('Error submitting review:', error);
            setError(error.response?.data?.error || 'Failed to submit review');
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
                `₹${booking.totalAmount || booking.amount}`
            ]],
            theme: 'grid',
            headStyles: { fillColor: [217, 119, 6] }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.text(`Location: ${booking.address}`, 20, finalY);
        if (booking.Pandit) {
            doc.text(`Pandit: ${booking.Pandit.name}`, 20, finalY + 7);
        }
        doc.text(`Advance Paid: ₹${booking.advanceAmount || 0}`, 20, finalY + 14);
        doc.text(`Remaining (to Pandit): ₹${booking.remainingAmount || 0}`, 20, finalY + 21);

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: ₹${booking.totalAmount || booking.amount}`, 140, finalY + 35);

        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Thank you for choosing DivyaKarya!', 20, 280);
        doc.text('For any queries, contact us at support@divyakarya.com', 20, 285);

        doc.save(`invoice-${booking.id}.pdf`);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#FEF3C7', color: '#92400E' },
            accepted: { bg: '#D1FAE5', color: '#065F46' },
            completed: { bg: '#DBEAFE', color: '#1E40AF' },
            rejected: { bg: '#FEE2E2', color: '#991B1B' },
            cancelled: { bg: '#F3F4F6', color: '#6B7280' }
        };
        const style = styles[status] || styles.pending;
        return (
            <span style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: style.bg,
                color: style.color
            }}>
                {status.toUpperCase()}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const colors = {
            pending: '#F59E0B',
            advance_paid: '#8B5CF6',
            paid: '#10B981',
            failed: '#EF4444',
            refunded: '#6B7280'
        };
        return (
            <span style={{ fontWeight: '600', color: colors[status] || '#F59E0B' }}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '5rem', paddingBottom: '3rem' }}>
            {/* Verification Warning */}
            {user && !user.isEmailVerified && (
                <div style={{
                    backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', color: '#B45309',
                    padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                    <div>
                        <strong>Email not verified.</strong> Please check your inbox for the verification link.
                    </div>
                </div>
            )}

            {/* Success Message */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, color: 'var(--primary)' }}>Namaste, {user.name}</h1>
                <button
                    onClick={openProfileModal}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                    <Edit size={16} /> Edit Profile
                </button>
            </div>

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
                                <option key={c.id} value={c.title}>{c.title} - ₹{c.basePrice || 2500}</option>
                            ))}
                        </select>

                        {/* Price Breakdown */}
                        {priceInfo && (
                            <div style={{
                                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                border: '1px solid #F59E0B'
                            }}>
                                <div style={{ fontWeight: '600', color: '#92400E', marginBottom: '0.5rem' }}>
                                    Payment Breakdown
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span>Total Amount:</span>
                                    <span style={{ fontWeight: '600' }}>₹{priceInfo.totalAmount}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: '#D97706' }}>
                                    <span>Advance (25%):</span>
                                    <span style={{ fontWeight: '700' }}>₹{priceInfo.advanceAmount}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#78716C' }}>
                                    <span>Remaining (pay to Pandit):</span>
                                    <span>₹{priceInfo.remainingAmount}</span>
                                </div>
                            </div>
                        )}

                        <label className="label">Date</label>
                        <input
                            type="date"
                            className="input"
                            required
                            value={newBooking.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => setNewBooking({ ...newBooking, date: e.target.value })}
                        />

                        <label className="label">Time</label>
                        <input
                            type="time"
                            className="input"
                            required
                            value={newBooking.time}
                            onChange={e => setNewBooking({ ...newBooking, time: e.target.value })}
                        />

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
                            disabled={submitting || !priceInfo}
                        >
                            {submitting ? 'Processing...' : `Pay ₹${priceInfo?.advanceAmount || 0} & Book`}
                        </button>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem', textAlign: 'center' }}>
                            25% advance payment required. Remaining ₹{priceInfo?.remainingAmount || 0} to be paid to Pandit after ceremony.
                        </p>
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
                                                    <MapPin size={14} /> {b.address}
                                                </span>
                                            </div>
                                        </div>
                                        {getStatusBadge(b.status)}
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

                                    {/* Payment Breakdown */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: '#F9FAFB',
                                        borderRadius: '8px',
                                        marginBottom: '1rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Total Amount</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                ₹{b.totalAmount || b.amount || 0}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Advance Paid</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: b.advancePaid ? '#10B981' : '#F59E0B' }}>
                                                ₹{b.advancePaid ? b.advanceAmount : 0}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Remaining</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6B7280' }}>
                                                ₹{b.remainingAmount || 0}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Refund Info for cancelled bookings */}
                                    {b.status === 'cancelled' && b.refundAmount > 0 && (
                                        <div style={{
                                            padding: '0.75rem',
                                            background: b.refundStatus === 'processed' ? '#D1FAE5' : '#FEF3C7',
                                            borderRadius: '8px',
                                            marginBottom: '1rem',
                                            fontSize: '0.9rem'
                                        }}>
                                            <strong>Refund:</strong> ₹{b.refundAmount} - {b.refundStatus === 'processed' ? 'Processed ✓' : 'Processing...'}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ fontSize: '0.85rem' }}>
                                                Payment: {getPaymentStatusBadge(b.paymentStatus)}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            {/* Pay Advance Button */}
                                            {!b.advancePaid && b.status !== 'cancelled' && b.status !== 'rejected' && (
                                                <button
                                                    onClick={() => handleAdvancePayment(b.id, b.advanceAmount)}
                                                    className="btn btn-primary"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <CreditCard size={16} /> Pay ₹{b.advanceAmount}
                                                </button>
                                            )}

                                            {/* Cancel Button */}
                                            {b.status !== 'cancelled' && b.status !== 'completed' && b.status !== 'rejected' && (
                                                <button
                                                    onClick={() => setShowCancelModal(b)}
                                                    className="btn btn-outline"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', borderColor: '#EF4444' }}
                                                >
                                                    <XCircle size={16} /> Cancel
                                                </button>
                                            )}

                                            {/* Invoice Button */}
                                            {b.advancePaid && (
                                                <button
                                                    onClick={() => generateInvoice(b)}
                                                    className="btn btn-outline"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <Download size={16} /> Invoice
                                                </button>
                                            )}

                                            {/* Review Button */}
                                            {b.status === 'completed' && (
                                                <button
                                                    onClick={() => {
                                                        setReviewForm({ rating: 5, comment: '' });
                                                        setShowReviewModal(b);
                                                    }}
                                                    className="btn btn-outline"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#F59E0B', color: '#F59E0B' }}
                                                >
                                                    <Star size={16} /> Review
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
                            <div style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                                ₹{ceremony.basePrice || 2500}
                            </div>
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

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <AlertCircle size={24} color="#EF4444" />
                            <h3 style={{ color: '#EF4444' }}>Cancel Booking</h3>
                        </div>

                        <p style={{ marginBottom: '1rem' }}>
                            Are you sure you want to cancel <strong>{showCancelModal.ceremonyType}</strong> on {showCancelModal.date}?
                        </p>

                        {showCancelModal.advancePaid && (
                            <div style={{
                                padding: '1rem',
                                background: getCancellationInfo(showCancelModal).refundType === 'full' ? '#D1FAE5' : '#FEF3C7',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <strong>Refund Policy:</strong>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                    {getCancellationInfo(showCancelModal).message}
                                </p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowCancelModal(null)}
                                className="btn btn-outline"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={() => handleCancelBooking(showCancelModal)}
                                className="btn"
                                disabled={cancellingId === showCancelModal.id}
                                style={{ background: '#EF4444', color: 'white' }}
                            >
                                {cancellingId === showCancelModal.id ? 'Cancelling...' : 'Confirm Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Profile Edit Modal */}
            {showProfileModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '400px', width: '90%', margin: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Edit Profile</h3>
                            <button onClick={() => setShowProfileModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <XCircle size={24} color="#6B7280" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProfile}>
                            <label className="label">Full Name</label>
                            <input
                                type="text" className="input" required
                                value={profileForm.name}
                                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                            />
                            <label className="label">Phone Number</label>
                            <input
                                type="tel" className="input" required
                                value={profileForm.phone}
                                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                            />
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowProfileModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Review Modal */}
            {showReviewModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '400px', width: '90%', margin: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Review Pandit</h3>
                            <button onClick={() => setShowReviewModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <XCircle size={24} color="#6B7280" />
                            </button>
                        </div>
                        <p style={{ marginBottom: '1rem' }}>
                            How was your experience with <strong>{showReviewModal.Pandit?.name}</strong> for <strong>{showReviewModal.ceremonyType}</strong>?
                        </p>
                        <form onSubmit={handleSubmitReview}>
                            <label className="label">Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: star <= reviewForm.rating ? '#F59E0B' : '#E5E7EB'
                                        }}
                                    >
                                        <Star size={32} fill={star <= reviewForm.rating ? '#F59E0B' : 'none'} />
                                    </button>
                                ))}
                            </div>

                            <label className="label">Comment</label>
                            <textarea
                                className="input" rows="3" required
                                placeholder="Share your experience..."
                                value={reviewForm.comment}
                                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            />

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowReviewModal(null)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
