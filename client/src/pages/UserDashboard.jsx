import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import { Calendar, MapPin, Clock, CreditCard } from 'lucide-react';

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
        // Check navigation state first (from Landing Page direct)
        if (location.state?.prefill) {
            setNewBooking(location.state.prefill);
            // Optional: Auto-scroll to form
            return;
        }

        // Check localStorage (from Landing Page -> Login -> Dashboard)
        const pending = localStorage.getItem('pendingBooking');
        if (pending) {
            try {
                const data = JSON.parse(pending);
                setNewBooking(data);
                localStorage.removeItem('pendingBooking'); // Clear it
                // Optional: Show a toast "Restored your booking details"
            } catch (e) {
                console.error("Error parsing pending booking", e);
            }
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bookings');
            setBookings(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/bookings', newBooking);
            fetchBookings();
            setNewBooking({ ceremonyType: '', date: '', time: '', address: '', amount: 1000 });
            alert('Booking request sent!');
        } catch (error) {
            alert('Error booking ceremony');
        }
    };

    const handlePayment = async (bookingId, amount) => {
        try {
            const orderRes = await axios.post('http://localhost:5000/api/payments/create-order', { amount, bookingId });
            const options = {
                key: 'rzp_test_123456', // Mock key
                amount: orderRes.data.amount,
                currency: "INR",
                name: "DivyaKarya",
                description: "Ceremony Booking",
                order_id: orderRes.data.id,
                handler: async function (response) {
                    await axios.post('http://localhost:5000/api/payments/verify', {
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
                    email: user.email,
                    contact: user.phone
                },
                theme: { color: "#D97706" }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error(error);
            // Mock success for demo if Razorpay script fails or key is invalid
            if (confirm('Razorpay Mock: Simulate Success?')) {
                // Manually trigger success in backend for demo
                // In real app, this wouldn't happen without signature
                alert('Please ensure Razorpay script is loaded in index.html');
            }
        }
    };

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Namaste, {user.name}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
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
                            <option value="Wedding">Wedding</option>
                            <option value="Funeral">Funeral</option>
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

                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Your Bookings</h3>
                    {bookings.length === 0 ? <p>No bookings yet.</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {bookings.map(b => (
                                <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--primary)' }}>{b.ceremonyType}</h4>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {b.date}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {b.time}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {b.address}</span>
                                        </div>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            Status: <span style={{ fontWeight: 'bold', color: b.status === 'accepted' ? 'var(--success)' : 'var(--text-light)' }}>{b.status.toUpperCase()}</span>
                                            {b.Pandit && <span> | Pandit: {b.Pandit.name}</span>}
                                        </div>
                                    </div>

                                    {b.status === 'accepted' && b.paymentStatus === 'pending' && (
                                        <button onClick={() => handlePayment(b.id, b.amount)} className="btn btn-primary">
                                            <CreditCard size={16} style={{ marginRight: '0.5rem' }} /> Pay ₹{b.amount}
                                        </button>
                                    )}
                                    {b.paymentStatus === 'paid' && <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>PAID</span>}
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
