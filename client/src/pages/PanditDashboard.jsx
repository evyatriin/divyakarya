import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PanditDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [isOnline, setIsOnline] = useState(false); // Ideally fetch from DB

    useEffect(() => {
        fetchBookings();
        // Fetch initial online status (omitted for brevity, defaulting false)
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bookings');
            setBookings(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStatus = async () => {
        try {
            const res = await axios.put('http://localhost:5000/api/pandits/status');
            setIsOnline(res.data.isOnline);
        } catch (error) {
            console.error(error);
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status });
            fetchBookings();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>Pandit Dashboard</h1>
                <button
                    onClick={toggleStatus}
                    className={`btn ${isOnline ? 'btn-primary' : 'btn-outline'}`}
                >
                    {isOnline ? 'You are Online' : 'Go Online'}
                </button>
            </div>

            <div className="card">
                <h3>Assigned Requests</h3>
                {bookings.length === 0 ? <p>No requests yet.</p> : (
                    <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '0.5rem' }}>Ceremony</th>
                                <th style={{ padding: '0.5rem' }}>Date/Time</th>
                                <th style={{ padding: '0.5rem' }}>Location</th>
                                <th style={{ padding: '0.5rem' }}>User</th>
                                <th style={{ padding: '0.5rem' }}>Status</th>
                                <th style={{ padding: '0.5rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem' }}>{b.ceremonyType}</td>
                                    <td style={{ padding: '0.5rem' }}>{b.date} {b.time}</td>
                                    <td style={{ padding: '0.5rem' }}>{b.address}</td>
                                    <td style={{ padding: '0.5rem' }}>{b.User?.name} ({b.User?.phone})</td>
                                    <td style={{ padding: '0.5rem' }}>{b.status}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {b.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => updateBookingStatus(b.id, 'accepted')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Accept</button>
                                                <button onClick={() => updateBookingStatus(b.id, 'rejected')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Reject</button>
                                            </div>
                                        )}
                                        {b.status === 'accepted' && <span style={{ color: 'var(--success)' }}>Accepted</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PanditDashboard;
