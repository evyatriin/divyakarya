import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, CreditCard, Download, XCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserDashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [newBooking, setNewBooking] = useState({
        ceremonyType: '', date: '', time: '', address: '', amount: 1000
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
        checkForPendingBooking();
    }, []);

    const checkForPendingBooking = () => {
        if (location.state?.prefill) {
            setNewBooking(location.state.prefill);
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
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/api/bookings`, newBooking);
            fetchBookings();
            setNewBooking({ ceremonyType: '', date: '', time: '', address: '', amount: 1000 });
            alert('Booking request sent!');
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error booking ceremony');
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
                    await axios.post(`${apiUrl}/api/payments/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        bookingId
                    });
                    fetchBookings();
                    alert('Payment Successful!');
                },
                prefill: {
                    name: user.name,
                    email: user.email || '',
                    contact: user.phone || ''
                },
                theme: { color: "#D97706" }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
        }
    };

    const generateInvoice = (booking) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(217, 119, 6);
        doc.text('DivyaKarya', 20, 20);

        doc.setFontSize(16);
        doc.text('INVOICE', 20, 35);

        // Invoice Details
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Invoice #: ${booking.id}`, 20, 45);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);

        // Customer Details
        doc.setFontSize(12);
        doc.text('Bill To:', 20, 65);
        doc.setFontSize(10);
        doc.text(user.name, 20, 72);
        doc.text(user.phone || '', 20, 79);
        doc.text(user.email || '', 20, 86);

        // Ceremony Details
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

        // Additional Details
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.text(`Location: ${booking.address || booking.city}`, 20, finalY);
        if (booking.Pandit) {
            doc.text(`Pandit: ${booking.Pandit.name}`, 20, finalY + 7);
        }
        doc.text(`Status: ${booking.status.toUpperCase()}`, 20, finalY + 14);
        doc.text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`, 20, finalY + 21);

        // Total
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: ₹${booking.amount}`, 140, finalY + 35);

        // Footer
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Thank you for choosing DivyaKarya!', 20, 280);
        doc.text('For any queries, contact us at support@divyakarya.com', 20, 285);

        // Save
        doc.save(`invoice-${booking.id}.pdf`);
    };

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Namaste, {user.name}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Booking Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Book a Ceremony</h3>
                    <form onSubmit={handleBook}>
                        <label className="label">Ceremony Type</label>
                        <select
                            className="input"
                            value={newBooking.ceremonyType}
                            onChange={e => setNewBooking({ ...newBooking, ceremonyType: e.target.value })}
                            required
                        >
                            <option value="">Select Ceremony</option>
                            <option value="Satyanarayan Puja">Satyanarayan Puja</option>
                            <option value="Griha Pravesh">Griha Pravesh</option>
                            <option value="Ganapathi Puja">Ganapathi Puja</option>
                            <option value="Naamkaranam">Naamkaranam</option>
                            <option value="Vivah Puja">Wedding</option>
                        </select>

                        <label className="label">Date</label>
                        <input type="date" className="input" required value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} />

                        <label className="label">Time</label>
                        <input type="time" className="input" required value={newBooking.time} onChange={e => setNewBooking({ ...newBooking, time: e.target.value })} />

                        <label className="label">Address</label>
                        <textarea className="input" required value={newBooking.address} onChange={e => setNewBooking({ ...newBooking, address: e.target.value })} />

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Request Pandit</button>
                    </form>
                </div>

                {/* Booking History */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem' }}>Your Booking History</h3>
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
                                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
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
        </div>
    );
};

export default UserDashboard;
