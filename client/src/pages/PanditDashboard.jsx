import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const PanditDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0, thisMonth: 0 });
    const [revenue, setRevenue] = useState({ totalRevenue: 0, totalCeremonies: 0, perCeremony: [], aggregateByCeremony: {} });
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);
    const [revenuePeriod, setRevenuePeriod] = useState('month');

    useEffect(() => {
        fetchData();
    }, [revenuePeriod]);

    const fetchData = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const [bookingsRes, statsRes, revenueRes] = await Promise.all([
                axios.get(`${apiUrl}/api/bookings`),
                axios.get(`${apiUrl}/api/pandits/stats`),
                axios.get(`${apiUrl}/api/pandits/revenue?period=${revenuePeriod}`)
            ]);
            setBookings(bookingsRes.data);
            setStats(statsRes.data);
            setRevenue(revenueRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.put(`${apiUrl}/api/pandits/status`);
            setIsOnline(res.data.isOnline);
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.put(`${apiUrl}/api/bookings/${id}/status`, { status });
            fetchData();
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const upcomingBookings = bookings.filter(b =>
        b.status === 'accepted' && new Date(b.date) >= new Date()
    ).slice(0, 5);

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>Pandit Dashboard</h1>
                <button
                    onClick={toggleStatus}
                    className={`btn ${isOnline ? 'btn-primary' : 'btn-outline'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isOnline ? '#10B981' : '#6B7280'
                    }}></div>
                    {isOnline ? 'Online' : 'Offline'}
                </button>
            </div>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stats.pending}</div>
                    <div style={{ color: 'var(--text-light)' }}>Pending Requests</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: '#10B981', marginBottom: '0.5rem' }}>{stats.accepted}</div>
                    <div style={{ color: 'var(--text-light)' }}>Accepted</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: '#6366F1', marginBottom: '0.5rem' }}>{stats.completed}</div>
                    <div style={{ color: 'var(--text-light)' }}>Completed</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: '#F59E0B', marginBottom: '0.5rem' }}>{stats.thisMonth}</div>
                    <div style={{ color: 'var(--text-light)' }}>This Month</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Revenue Section */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <DollarSign size={24} color="var(--primary)" />
                            Revenue Tracking
                        </h3>
                        <select
                            value={revenuePeriod}
                            onChange={(e) => setRevenuePeriod(e.target.value)}
                            className="input"
                            style={{ width: 'auto', padding: '0.5rem' }}
                        >
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                        padding: '2rem',
                        borderRadius: '12px',
                        color: 'white',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Earnings</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                            ₹{revenue.totalRevenue.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
                            {revenue.totalCeremonies} ceremonies completed
                        </div>
                    </div>

                    {/* Aggregate by Ceremony Type */}
                    <h4 style={{ marginBottom: '1rem' }}>Earnings by Ceremony Type</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {Object.entries(revenue.aggregateByCeremony).map(([type, data]) => (
                            <div key={type} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.75rem',
                                background: '#F9FAFB',
                                borderRadius: '8px'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{type}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                        {data.count} ceremony{data.count > 1 ? 'ies' : ''}
                                    </div>
                                </div>
                                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                    ₹{data.total.toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {Object.keys(revenue.aggregateByCeremony).length === 0 && (
                            <p style={{ color: 'var(--text-light)', textAlign: 'center' }}>No completed ceremonies yet</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Ceremonies */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Calendar size={24} color="var(--primary)" />
                        Upcoming
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {upcomingBookings.map(b => (
                            <div key={b.id} style={{
                                padding: '1rem',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                borderLeft: '4px solid var(--primary)'
                            }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{b.ceremonyType}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                    <div>{b.date} at {b.time}</div>
                                    <div>{b.city || b.address}</div>
                                </div>
                            </div>
                        ))}
                        {upcomingBookings.length === 0 && (
                            <p style={{ color: 'var(--text-light)', textAlign: 'center' }}>No upcoming ceremonies</p>
                        )}
                    </div>
                </div>
            </div>

            {/* All Requests */}
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>All Requests</h3>
                {bookings.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>No requests yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                                    <th style={{ padding: '0.75rem' }}>Ceremony</th>
                                    <th style={{ padding: '0.75rem' }}>Date/Time</th>
                                    <th style={{ padding: '0.75rem' }}>Location</th>
                                    <th style={{ padding: '0.75rem' }}>Customer</th>
                                    <th style={{ padding: '0.75rem' }}>Status</th>
                                    <th style={{ padding: '0.75rem' }}>Amount</th>
                                    <th style={{ padding: '0.75rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: '0.75rem' }}>{b.ceremonyType}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div>{b.date}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{b.time}</div>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>{b.city || b.address}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div>{b.customerName || b.User?.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                {b.customerPhone || b.User?.phone}
                                            </div>
                                        </td>
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
                                        <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                                            ₹{b.amount || 0}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            {b.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => updateBookingStatus(b.id, 'accepted')}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                    >
                                                        <CheckCircle size={14} /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => updateBookingStatus(b.id, 'rejected')}
                                                        className="btn btn-outline"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                    >
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PanditDashboard;
