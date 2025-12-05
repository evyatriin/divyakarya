import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, DollarSign, TrendingUp, UserCheck, XCircle, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [pandits, setPandits] = useState([]);
    const [availablePandits, setAvailablePandits] = useState({ availablePandits: [], unscheduledPandits: [] });
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        advanceCollected: 0,
        activePandits: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
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

    const fetchAvailablePandits = async (booking) => {
        try {
            const res = await axios.get(`${apiUrl}/api/admin/available-pandits`, {
                params: { date: booking.date, time: booking.time }
            });
            setAvailablePandits(res.data);
            setSelectedBooking(booking);
        } catch (error) {
            console.error('Error fetching available pandits:', error);
        }
    };

    const assignPandit = async (bookingId, panditId, slotId = null) => {
        try {
            await axios.put(`${apiUrl}/api/admin/assign`, { bookingId, panditId, slotId });
            setSelectedBooking(null);
            fetchData();
            alert('Pandit assigned successfully!');
        } catch (error) {
            console.error('Error assigning pandit:', error);
            alert(error.response?.data?.error || 'Error assigning pandit');
        }
    };

    const processRefund = async (bookingId) => {
        try {
            const res = await axios.post(`${apiUrl}/api/payments/process-refund`, { bookingId });
            alert(res.data.message);
            fetchData();
        } catch (error) {
            console.error('Error processing refund:', error);
            alert(error.response?.data?.error || 'Failed to process refund');
        }
    };

    const filteredBookings = statusFilter === 'all'
        ? bookings
        : bookings.filter(b => b.status === statusFilter);

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#FEF3C7', color: '#92400E' },
            accepted: { bg: '#D1FAE5', color: '#065F46' },
            completed: { bg: '#DBEAFE', color: '#1E40AF' },
            rejected: { bg: '#FEE2E2', color: '#991B1B' },
            cancelled: { bg: '#F3F4F6', color: '#6B7280' }
        };
        const s = styles[status] || styles.pending;
        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: s.bg,
                color: s.color
            }}>
                {status}
            </span>
        );
    };

    const getPaymentBadge = (status) => {
        const colors = {
            pending: '#F59E0B',
            advance_paid: '#8B5CF6',
            paid: '#10B981',
            failed: '#EF4444',
            refunded: '#6B7280'
        };
        return (
            <span style={{ fontWeight: '600', color: colors[status] || '#F59E0B', fontSize: '0.8rem' }}>
                {status?.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Admin Dashboard</h1>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <Calendar size={28} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.totalBookings}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Total Bookings</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <TrendingUp size={28} color="#F59E0B" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.pendingBookings}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Pending</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <DollarSign size={28} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>₹{stats.totalRevenue?.toLocaleString()}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Total Revenue</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <DollarSign size={28} color="#8B5CF6" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>₹{stats.advanceCollected?.toLocaleString()}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Advances Collected</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <UserCheck size={28} color="#6366F1" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.activePandits}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Active Pandits</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <XCircle size={28} color="#EF4444" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.cancelledBookings}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Cancelled</div>
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
                        style={{ width: 'auto', padding: '0.5rem', marginBottom: 0 }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
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
                                <th style={{ padding: '0.75rem' }}>Status</th>
                                <th style={{ padding: '0.75rem' }}>Payment</th>
                                <th style={{ padding: '0.75rem' }}>Amounts</th>
                                <th style={{ padding: '0.75rem' }}>Pandit</th>
                                <th style={{ padding: '0.75rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <td style={{ padding: '0.75rem' }}>#{b.id}</td>
                                    <td style={{ padding: '0.75rem' }}>{b.ceremonyType}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div>{b.User?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                            {b.User?.phone}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div>{b.date}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{b.time}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{getStatusBadge(b.status)}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {getPaymentBadge(b.paymentStatus)}
                                        {b.refundStatus && b.refundStatus !== 'none' && (
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                                                Refund: ₹{b.refundAmount} ({b.refundStatus})
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>
                                            <div>Total: <strong>₹{b.totalAmount || b.amount || 0}</strong></div>
                                            <div style={{ color: '#8B5CF6' }}>Advance: ₹{b.advanceAmount || 0}</div>
                                            <div style={{ color: '#10B981' }}>Remaining: ₹{b.remainingAmount || 0}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{b.Pandit?.name || 'Unassigned'}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {!b.PanditId && b.status !== 'cancelled' && (
                                            <button
                                                onClick={() => fetchAvailablePandits(b)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            >
                                                Assign
                                            </button>
                                        )}
                                        {b.status === 'cancelled' && b.refundStatus === 'pending' && (
                                            <button
                                                onClick={() => processRefund(b.id)}
                                                className="btn"
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    fontSize: '0.85rem',
                                                    background: '#8B5CF6',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}
                                            >
                                                <RefreshCw size={14} /> Process Refund
                                            </button>
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

            {/* Pandit Assignment Modal */}
            {selectedBooking && (
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
                    <div className="card" style={{ maxWidth: '600px', margin: '1rem', maxHeight: '80vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Assign Pandit for Booking #{selectedBooking.id}</h3>
                            <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#F9FAFB', borderRadius: '8px' }}>
                            <div><strong>{selectedBooking.ceremonyType}</strong></div>
                            <div style={{ color: 'var(--text-light)' }}>{selectedBooking.date} at {selectedBooking.time}</div>
                            <div style={{ color: 'var(--text-light)' }}>{selectedBooking.address}</div>
                        </div>

                        {/* Available Pandits */}
                        {availablePandits.availablePandits.length > 0 && (
                            <>
                                <h4 style={{ color: '#10B981', marginBottom: '0.5rem' }}>Available (has set availability)</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {availablePandits.availablePandits.map(p => (
                                        <div key={p.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.75rem',
                                            border: '1px solid #10B981',
                                            borderRadius: '8px',
                                            background: '#D1FAE5'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{p.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                    {p.specialization} • {p.experience} yrs exp
                                                </div>
                                                {p.availableSlots && p.availableSlots.length > 0 && (
                                                    <div style={{ fontSize: '0.75rem', color: '#065F46' }}>
                                                        Slots: {p.availableSlots.map(s => `${s.startTime}-${s.endTime}`).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => assignPandit(
                                                    selectedBooking.id,
                                                    p.id,
                                                    p.availableSlots?.[0]?.id
                                                )}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem' }}
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Unscheduled Pandits */}
                        {availablePandits.unscheduledPandits.length > 0 && (
                            <>
                                <h4 style={{ color: '#F59E0B', marginBottom: '0.5rem' }}>Other Pandits (no schedule set)</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {availablePandits.unscheduledPandits.map(p => (
                                        <div key={p.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.75rem',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{p.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                    {p.specialization} • {p.experience} yrs exp
                                                    {p.isOnline && <span style={{ color: '#10B981', marginLeft: '0.5rem' }}>● Online</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => assignPandit(selectedBooking.id, p.id)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem 0.8rem' }}
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {availablePandits.availablePandits.length === 0 &&
                            availablePandits.unscheduledPandits.length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                                    No pandits found.
                                </p>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
