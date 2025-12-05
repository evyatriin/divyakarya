import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, DollarSign, TrendingUp, UserCheck, XCircle, RefreshCw, Plus, Edit, Trash2, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [pandits, setPandits] = useState([]);
    const [ceremonies, setCeremonies] = useState([]);
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

    // Ceremony form state
    const [showCeremonyModal, setShowCeremonyModal] = useState(false);
    const [editingCeremony, setEditingCeremony] = useState(null);
    const [ceremonyForm, setCeremonyForm] = useState({
        title: '', slug: '', description: '', icon: '🕉️', image: '',
        basePrice: 2500, samagri: '', process: ''
    });

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsRes, panditsRes, statsRes, ceremoniesRes] = await Promise.all([
                axios.get(`${apiUrl}/api/bookings`),
                axios.get(`${apiUrl}/api/pandits`),
                axios.get(`${apiUrl}/api/admin/stats`),
                axios.get(`${apiUrl}/api/ceremonies`)
            ]);
            setBookings(bookingsRes.data);
            setPandits(panditsRes.data);
            setStats(statsRes.data);
            setCeremonies(ceremoniesRes.data);
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
            alert(error.response?.data?.error || 'Error assigning pandit');
        }
    };

    const processRefund = async (bookingId) => {
        try {
            const res = await axios.post(`${apiUrl}/api/payments/process-refund`, { bookingId });
            alert(res.data.message);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to process refund');
        }
    };

    // Ceremony CRUD
    const openCeremonyModal = (ceremony = null) => {
        if (ceremony) {
            setEditingCeremony(ceremony);
            setCeremonyForm({
                title: ceremony.title,
                slug: ceremony.slug,
                description: ceremony.description || '',
                icon: ceremony.icon || '🕉️',
                image: ceremony.image || '',
                basePrice: ceremony.basePrice || 2500,
                samagri: (ceremony.samagri || []).join(', '),
                process: (ceremony.process || []).join(', ')
            });
        } else {
            setEditingCeremony(null);
            setCeremonyForm({
                title: '', slug: '', description: '', icon: '🕉️', image: '',
                basePrice: 2500, samagri: '', process: ''
            });
        }
        setShowCeremonyModal(true);
    };

    const saveCeremony = async () => {
        try {
            const data = {
                ...ceremonyForm,
                samagri: ceremonyForm.samagri.split(',').map(s => s.trim()).filter(s => s),
                process: ceremonyForm.process.split(',').map(s => s.trim()).filter(s => s),
                basePrice: parseFloat(ceremonyForm.basePrice) || 2500
            };

            if (editingCeremony) {
                await axios.put(`${apiUrl}/api/ceremonies/${editingCeremony.id}`, data);
                alert('Ceremony updated!');
            } else {
                await axios.post(`${apiUrl}/api/ceremonies`, data);
                alert('Ceremony created!');
            }
            setShowCeremonyModal(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Error saving ceremony');
        }
    };

    const deleteCeremony = async (id) => {
        if (!confirm('Are you sure you want to delete this ceremony?')) return;
        try {
            await axios.delete(`${apiUrl}/api/ceremonies/${id}`);
            alert('Ceremony deleted!');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Error deleting ceremony');
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
            <h1 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Admin Dashboard</h1>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {['bookings', 'ceremonies'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={activeTab === tab ? 'btn btn-primary' : 'btn btn-outline'}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {tab === 'ceremonies' ? <><Settings size={16} style={{ marginRight: '0.5rem' }} />Manage Pujas</> : 'Bookings'}
                    </button>
                ))}
            </div>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                    <Calendar size={24} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalBookings}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Total Bookings</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                    <TrendingUp size={24} color="#F59E0B" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pendingBookings}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Pending</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                    <DollarSign size={24} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{stats.totalRevenue?.toLocaleString()}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Revenue</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                    <UserCheck size={24} color="#6366F1" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.activePandits}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Pandits</div>
                </div>
            </div>

            {activeTab === 'bookings' && (
                <>
                    {/* Online Pandits */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Online Pandits ({pandits.filter(p => p.isOnline).length})</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {pandits.filter(p => p.isOnline).map(p => (
                                <div key={p.id} style={{
                                    border: '1px solid #E5E7EB',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    minWidth: '180px'
                                }}>
                                    <div style={{ fontWeight: '600' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{p.specialization}</div>
                                </div>
                            ))}
                            {pandits.filter(p => p.isOnline).length === 0 && (
                                <p style={{ color: 'var(--text-light)' }}>No pandits online.</p>
                            )}
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Bookings</h3>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input"
                                style={{ width: 'auto', padding: '0.5rem', marginBottom: 0 }}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                                        <th style={{ padding: '0.5rem' }}>ID</th>
                                        <th style={{ padding: '0.5rem' }}>Ceremony</th>
                                        <th style={{ padding: '0.5rem' }}>Date</th>
                                        <th style={{ padding: '0.5rem' }}>Status</th>
                                        <th style={{ padding: '0.5rem' }}>Amounts</th>
                                        <th style={{ padding: '0.5rem' }}>Pandit</th>
                                        <th style={{ padding: '0.5rem' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map(b => (
                                        <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '0.5rem' }}>#{b.id}</td>
                                            <td style={{ padding: '0.5rem' }}>{b.ceremonyType}</td>
                                            <td style={{ padding: '0.5rem' }}>{b.date}<br /><small>{b.time}</small></td>
                                            <td style={{ padding: '0.5rem' }}>{getStatusBadge(b.status)}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <div style={{ fontSize: '0.8rem' }}>
                                                    <div>₹{b.totalAmount || b.amount}</div>
                                                    <div style={{ color: '#8B5CF6' }}>Adv: ₹{b.advanceAmount || 0}</div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>{b.Pandit?.name || '-'}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                {!b.PanditId && b.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => fetchAvailablePandits(b)}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                                    >
                                                        Assign
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'ceremonies' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Manage Pujas / Ceremonies</h3>
                        <button onClick={() => openCeremonyModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add New Puja
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                                    <th style={{ padding: '0.75rem' }}>Icon</th>
                                    <th style={{ padding: '0.75rem' }}>Title</th>
                                    <th style={{ padding: '0.75rem' }}>Slug</th>
                                    <th style={{ padding: '0.75rem' }}>Price</th>
                                    <th style={{ padding: '0.75rem' }}>Samagri Items</th>
                                    <th style={{ padding: '0.75rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ceremonies.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: '0.75rem', fontSize: '1.5rem' }}>{c.icon}</td>
                                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{c.title}</td>
                                        <td style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{c.slug}</td>
                                        <td style={{ padding: '0.75rem', fontWeight: '600', color: '#10B981' }}>₹{c.basePrice}</td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                                            {(c.samagri || []).slice(0, 3).join(', ')}{c.samagri?.length > 3 ? '...' : ''}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <button
                                                onClick={() => openCeremonyModal(c)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.3rem 0.5rem', marginRight: '0.5rem' }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteCeremony(c.id)}
                                                className="btn"
                                                style={{ padding: '0.3rem 0.5rem', background: '#FEE2E2', color: '#991B1B' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {ceremonies.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                            No ceremonies found. Add your first puja!
                        </p>
                    )}
                </div>
            )}

            {/* Ceremony Edit Modal */}
            {showCeremonyModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '600px', margin: '1rem', maxHeight: '90vh', overflow: 'auto' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{editingCeremony ? 'Edit Puja' : 'Add New Puja'}</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Title *</label>
                                <input
                                    className="input"
                                    value={ceremonyForm.title}
                                    onChange={e => setCeremonyForm({ ...ceremonyForm, title: e.target.value })}
                                    placeholder="e.g., Satyanarayan Puja"
                                />
                            </div>
                            <div>
                                <label className="label">Slug *</label>
                                <input
                                    className="input"
                                    value={ceremonyForm.slug}
                                    onChange={e => setCeremonyForm({ ...ceremonyForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    placeholder="e.g., satyanarayan-puja"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Price (₹) *</label>
                                <input
                                    className="input"
                                    type="number"
                                    value={ceremonyForm.basePrice}
                                    onChange={e => setCeremonyForm({ ...ceremonyForm, basePrice: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Icon (emoji)</label>
                                <input
                                    className="input"
                                    value={ceremonyForm.icon}
                                    onChange={e => setCeremonyForm({ ...ceremonyForm, icon: e.target.value })}
                                />
                            </div>
                        </div>

                        <label className="label">Description</label>
                        <textarea
                            className="input"
                            value={ceremonyForm.description}
                            onChange={e => setCeremonyForm({ ...ceremonyForm, description: e.target.value })}
                            rows={3}
                        />

                        <label className="label">Image URL</label>
                        <input
                            className="input"
                            value={ceremonyForm.image}
                            onChange={e => setCeremonyForm({ ...ceremonyForm, image: e.target.value })}
                            placeholder="https://..."
                        />

                        <label className="label">Samagri Items (comma-separated)</label>
                        <input
                            className="input"
                            value={ceremonyForm.samagri}
                            onChange={e => setCeremonyForm({ ...ceremonyForm, samagri: e.target.value })}
                            placeholder="Kumkum, Turmeric, Rice, Flowers..."
                        />

                        <label className="label">Process Steps (comma-separated)</label>
                        <input
                            className="input"
                            value={ceremonyForm.process}
                            onChange={e => setCeremonyForm({ ...ceremonyForm, process: e.target.value })}
                            placeholder="Ganesh Puja, Havan, Aarti..."
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowCeremonyModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                                Cancel
                            </button>
                            <button onClick={saveCeremony} className="btn btn-primary" style={{ flex: 1 }}>
                                {editingCeremony ? 'Update' : 'Create'} Puja
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pandit Assignment Modal */}
            {selectedBooking && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '1rem', maxHeight: '80vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Assign Pandit - Booking #{selectedBooking.id}</h3>
                            <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#F9FAFB', borderRadius: '8px' }}>
                            <div><strong>{selectedBooking.ceremonyType}</strong></div>
                            <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{selectedBooking.date} at {selectedBooking.time}</div>
                        </div>

                        {availablePandits.availablePandits.map(p => (
                            <div key={p.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '0.75rem', border: '1px solid #10B981', borderRadius: '8px',
                                background: '#D1FAE5', marginBottom: '0.5rem'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{p.specialization}</div>
                                </div>
                                <button onClick={() => assignPandit(selectedBooking.id, p.id, p.availableSlots?.[0]?.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>
                                    Assign
                                </button>
                            </div>
                        ))}

                        {availablePandits.unscheduledPandits.map(p => (
                            <div key={p.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '0.5rem'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{p.specialization}</div>
                                </div>
                                <button onClick={() => assignPandit(selectedBooking.id, p.id)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                                    Assign
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
