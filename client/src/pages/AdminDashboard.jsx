import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [pandits, setPandits] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsRes, panditsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/bookings'),
                axios.get('http://localhost:5000/api/pandits')
            ]);
            setBookings(bookingsRes.data);
            setPandits(panditsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const assignPandit = async (bookingId, panditId) => {
        try {
            await axios.put('http://localhost:5000/api/admin/assign', { bookingId, panditId });
            fetchData();
            alert('Pandit Assigned!');
        } catch (error) {
            alert('Error assigning pandit');
        }
    };

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Admin Dashboard</h1>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <div className="card">
                    <h3>Online Pandits</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {pandits.map(p => (
                            <div key={p.id} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                                <strong>{p.name}</strong>
                                <div>{p.specialization}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Online</div>
                            </div>
                        ))}
                        {pandits.length === 0 && <p>No pandits online.</p>}
                    </div>
                </div>

                <div className="card">
                    <h3>All Bookings</h3>
                    <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '0.5rem' }}>ID</th>
                                <th style={{ padding: '0.5rem' }}>Ceremony</th>
                                <th style={{ padding: '0.5rem' }}>User</th>
                                <th style={{ padding: '0.5rem' }}>Status</th>
                                <th style={{ padding: '0.5rem' }}>Assigned To</th>
                                <th style={{ padding: '0.5rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem' }}>#{b.id}</td>
                                    <td style={{ padding: '0.5rem' }}>{b.ceremonyType}</td>
                                    <td style={{ padding: '0.5rem' }}>{b.User?.name}</td>
                                    <td style={{ padding: '0.5rem' }}>{b.status}</td>
                                    <td style={{ padding: '0.5rem' }}>{b.Pandit?.name || 'Unassigned'}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {!b.PanditId && (
                                            <select
                                                onChange={(e) => assignPandit(b.id, e.target.value)}
                                                className="input"
                                                style={{ padding: '0.25rem', marginBottom: 0 }}
                                            >
                                                <option value="">Assign Pandit</option>
                                                {pandits.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
