import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, DollarSign, TrendingUp, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [pandits, setPandits] = useState([]);
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        activePandits: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const [bookingsRes, panditsRes, statsRes] = await Promise.all([
                axios.get(`${apiUrl}/api/bookings`),
                axios.get(`${apiUrl}/api/pandits`),
                axios.get(`${apiUrl}/api/admin/stats`)
            ]);
            setBookings(bookingsRes.data);
            setPandits(panditsRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const assignPandit = async (bookingId, panditId) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.put(`${apiUrl}/api/admin/assign`, { bookingId, panditId });
            fetchData();
            alert('Pandit assigned successfully!');
        } catch (error) {
            console.error('Error assigning pandit:', error);
            alert('Error assigning pandit');
        }
    };

    const filteredBookings = statusFilter === 'all'
        ? bookings
        : bookings.filter(b => b.status === statusFilter);

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Admin Dashboard</h1>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <Calendar size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.totalBookings}</div>
                    <div style={{ color: 'var(--text-light)' }}>Total Bookings</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <TrendingUp size={32} color="#F59E0B" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.pendingBookings}</div>
                    <div style={{ color: 'var(--text-light)' }}>Pending</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <DollarSign size={32} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>₹{stats.totalRevenue.toLocaleString()}</div>
                    <div style={{ color: 'var(--text-light)' }}>Total Revenue</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <UserCheck size={32} color="#6366F1" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.activePandits}</div>
                    <div style={{ color: 'var(--text-light)' }}>Active Pandits</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <Users size={32} color="#EC4899" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.totalUsers}</div>
                    <div style={{ color: 'var(--text-light)' }}>Total Users</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <Calendar size={32} color="#8B5CF6" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.completedBookings}</div>
                    <div style={{ color: 'var(--text-light)' }}>Completed</div>
                </div>
            </div>

            {/* Online Pandits */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Online Pandits ({pandits.filter(p => p.isOnline).length})</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {pandits.filter(p => p.isOnline).map(p => (
                        <div key={p.id} style={{
                            border: '1px solid #E5E7EB',
                            padding: '1rem',
                            borderRadius: '8px',
                            minWidth: '200px'
                        }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                                {p.specialization}
                            </div>
                            <div style={{ fontSize: '0.85rem' }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#10B981',
                                    marginRight: '0.5rem'
                                }}></span>
                                Online
                            </div>
                        </div>
                    ))}
                    {pandits.filter(p => p.isOnline).length === 0 && (
                        <p style={{ color: 'var(--text-light)' }}>No pandits online currently.</p>
                    )}
                </div>
            </div>

            {/* All Bookings */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Booking Requests</h3>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input"
                        style={{ width: 'auto', padding: '0.5rem' }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                                <th style={{ padding: '0.75rem' }}>ID</th>
                                <th style={{ padding: '0.75rem' }}>Ceremony</th>
                                <th style={{ padding: '0.75rem' }}>Customer</th>
                                <th style={{ padding: '0.75rem' }}>Date/Time</th>
                                <th style={{ padding: '0.75rem' }}>Location</th>
                                <th style={{ padding: '0.75rem' }}>Status</th>
                                <th style={{ padding: '0.75rem' }}>Assigned To</th>
                                <th style={{ padding: '0.75rem' }}>Amount</th>
                                <th style={{ padding: '0.75rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <td style={{ padding: '0.75rem' }}>#{b.id}</td>
                                    <td style={{ padding: '0.75rem' }}>{b.ceremonyType}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div>{b.customerName || b.User?.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                            {b.customerPhone || b.User?.phone}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                            {b.customerEmail || b.User?.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div>{b.date}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{b.time}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{b.city || b.address}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            background: b.status === 'accepted' ? '#D1FAE5' :
                                                b.status === 'completed' ? '#DBEAFE' :
                                                    b.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                                            color: b.status === 'accepted' ? '#065F46' :
                                                b.status === 'completed' ? '#1E40AF' :
                                                    b.status === 'rejected' ? '#991B1B' : '#92400E'
                                        }}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{b.Pandit?.name || 'Unassigned'}</td>
                                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>₹{b.amount || 0}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {!b.PanditId && (
                                            <select
                                                onChange={(e) => assignPandit(b.id, e.target.value)}
                                                className="input"
                                                style={{ padding: '0.4rem', marginBottom: 0, fontSize: '0.85rem' }}
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

                {filteredBookings.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                        No bookings found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
