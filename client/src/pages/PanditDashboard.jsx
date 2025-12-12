import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, DollarSign, Clock, CheckCircle, XCircle, Plus, Trash2, Edit, Star } from 'lucide-react';

const PanditDashboard = () => {
    const { user, updateUser } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [doshaBookings, setDoshaBookings] = useState([]);
    const [epujaBookings, setEpujaBookings] = useState([]);
    const [bookingType, setBookingType] = useState('ceremonies');
    const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0, thisMonth: 0, rating: 0, totalReviews: 0 });
    const [revenue, setRevenue] = useState({ totalRevenue: 0, totalCeremonies: 0, perCeremony: [], aggregateByCeremony: {} });
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);
    const [revenuePeriod, setRevenuePeriod] = useState('month');

    // Availability state
    const [availability, setAvailability] = useState([]);
    const [showAddSlot, setShowAddSlot] = useState(false);
    const [newSlot, setNewSlot] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '18:00'
    });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Profile state
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: '', phone: '', bio: '', photo: '', experience: 0, specialization: ''
    });
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    // Inline notification states
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmDeleteSlot, setConfirmDeleteSlot] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchData();
    }, [revenuePeriod]);

    useEffect(() => {
        fetchAvailability();
    }, [selectedDate]);

    const fetchData = async () => {
        try {
            const [bookingsRes, statsRes, revenueRes] = await Promise.all([
                axios.get(`${apiUrl}/api/bookings`),
                axios.get(`${apiUrl}/api/pandits/stats`),
                axios.get(`${apiUrl}/api/pandits/revenue?period=${revenuePeriod}`)
            ]);
            setBookings(bookingsRes.data);
            setStats(statsRes.data);
            setRevenue(revenueRes.data);

            // Fetch dosha and epuja bookings
            try {
                const doshaRes = await axios.get(`${apiUrl}/api/dosha-bookings/pandit`);
                setDoshaBookings(doshaRes.data);
            } catch (e) {
                console.log('No dosha bookings or no access');
            }

            try {
                const epujaRes = await axios.get(`${apiUrl}/api/epuja-bookings/pandit`);
                setEpujaBookings(epujaRes.data);
            } catch (e) {
                console.log('No epuja bookings or no access');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const fetchAvailability = async () => {
        try {
            const startDate = selectedDate;
            const endDate = new Date(new Date(selectedDate).getTime() + 6 * 24 * 60 * 60 * 1000)
                .toISOString().split('T')[0];

            const res = await axios.get(`${apiUrl}/api/availability/pandit/${user.id}?startDate=${startDate}&endDate=${endDate}`);
            setAvailability(res.data);
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const toggleStatus = async () => {
        try {
            const res = await axios.put(`${apiUrl}/api/pandits/status`);
            setIsOnline(res.data.isOnline);
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            await axios.put(`${apiUrl}/api/bookings/${id}/status`, { status });
            fetchData();
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const addAvailabilitySlot = async () => {
        try {
            await axios.post(`${apiUrl}/api/availability`, newSlot);
            setShowAddSlot(false);
            setNewSlot({
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '18:00'
            });
            fetchAvailability();
            setSuccessMessage('Slot added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error adding slot:', err);
            setError(err.response?.data?.error || 'Failed to add slot');
            setTimeout(() => setError(''), 5000);
        }
    };

    const deleteSlot = async (slotId) => {
        try {
            await axios.delete(`${apiUrl}/api/availability/${slotId}`);
            fetchAvailability();
            setConfirmDeleteSlot(null);
            setSuccessMessage('Slot deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error deleting slot:', err);
            setConfirmDeleteSlot(null);
            setError(err.response?.data?.error || 'Failed to delete slot');
            setTimeout(() => setError(''), 5000);
        }
    };

    const addWeekSlots = async () => {
        const slots = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(new Date(selectedDate).getTime() + i * 24 * 60 * 60 * 1000);
            slots.push({
                date: date.toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '18:00'
            });
        }
        try {
            await axios.post(`${apiUrl}/api/availability/bulk`, { slots });
            fetchAvailability();
        } catch (error) {
            console.error('Error adding week slots:', error);
        }
    };

    const upcomingBookings = bookings.filter(b =>
        b.status === 'accepted' && new Date(b.date) >= new Date()
    ).slice(0, 5);

    const openProfileModal = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/pandits/profile`);
            const p = res.data;
            setProfileForm({
                name: p.name || '',
                phone: p.phone || '',
                bio: p.bio || '',
                photo: p.photo || '',
                experience: p.experience || 0,
                specialization: p.specialization || ''
            });
            setShowProfileModal(true);
            setProfileError('');
            setProfileSuccess('');
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        try {
            const res = await axios.put(`${apiUrl}/api/pandits/profile`, profileForm);
            updateUser(res.data);
            setProfileSuccess('Profile updated successfully!');
            setTimeout(() => setShowProfileModal(false), 1500);
        } catch (error) {
            console.error('Error updating profile:', error);
            setProfileError(error.response?.data?.error || 'Failed to update profile');
        }
    };

    const getSlotTypeColor = (slot) => {
        if (slot.slotType === 'booked') return { bg: '#DBEAFE', border: '#3B82F6' };
        if (slot.slotType === 'blocked') return { bg: '#FEE2E2', border: '#EF4444' };
        return { bg: '#D1FAE5', border: '#10B981' };
    };

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
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

            {/* Inline Error Banner */}
            {error && (
                <div style={{
                    backgroundColor: '#FEE2E2', border: '1px solid #EF4444', color: '#991B1B',
                    padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <XCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {/* Inline Success Banner */}
            {successMessage && (
                <div style={{
                    backgroundColor: '#D1FAE5', border: '1px solid #10B981', color: '#065F46',
                    padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <CheckCircle size={20} />
                    <span>{successMessage}</span>
                    <button onClick={() => setSuccessMessage('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDeleteSlot && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3>Delete Slot?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                            Are you sure you want to delete this availability slot?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => setConfirmDeleteSlot(null)} className="btn btn-outline">Cancel</button>
                            <button onClick={() => deleteSlot(confirmDeleteSlot)} className="btn btn-primary" style={{ backgroundColor: '#EF4444' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <h1 style={{ color: 'var(--primary)', margin: 0 }}>Pandit Dashboard</h1>
                    <button
                        onClick={openProfileModal}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <Edit size={16} /> Edit Profile
                    </button>
                </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stats.pending}</div>
                    <div style={{ color: 'var(--text-light)' }}>Pending</div>
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

            {/* Availability Management */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={24} color="var(--primary)" />
                        My Availability
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="input"
                            style={{ width: 'auto', padding: '0.5rem', marginBottom: 0, minWidth: '140px' }}
                        />
                        <button onClick={addWeekSlots} className="btn btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                            + Week
                        </button>
                        <button onClick={() => setShowAddSlot(true)} className="btn btn-primary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                            <Plus size={16} /> Slot
                        </button>
                    </div>
                </div>

                {/* Add Slot Modal */}
                {showAddSlot && (
                    <div style={{
                        background: '#F9FAFB',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div>
                                <label className="label" style={{ fontSize: '0.8rem' }}>Date</label>
                                <input
                                    type="date"
                                    value={newSlot.date}
                                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                                    className="input"
                                    style={{ marginBottom: 0, padding: '0.5rem' }}
                                />
                            </div>
                            <div>
                                <label className="label" style={{ fontSize: '0.8rem' }}>Start</label>
                                <input
                                    type="time"
                                    value={newSlot.startTime}
                                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                    className="input"
                                    style={{ marginBottom: 0, padding: '0.5rem' }}
                                />
                            </div>
                            <div>
                                <label className="label" style={{ fontSize: '0.8rem' }}>End</label>
                                <input
                                    type="time"
                                    value={newSlot.endTime}
                                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                    className="input"
                                    style={{ marginBottom: 0, padding: '0.5rem' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button onClick={addAvailabilitySlot} className="btn btn-primary" style={{ flex: '1', minWidth: '80px' }}>Save</button>
                            <button onClick={() => setShowAddSlot(false)} className="btn btn-outline" style={{ flex: '1', minWidth: '80px' }}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Availability Slots */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {availability.length === 0 ? (
                        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
                            No availability set for this week. Click "Add Week" to set up your schedule.
                        </p>
                    ) : (
                        availability.map(slot => {
                            const colors = getSlotTypeColor(slot);
                            return (
                                <div key={slot.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem 1rem',
                                    background: colors.bg,
                                    borderLeft: `4px solid ${colors.border}`,
                                    borderRadius: '8px'
                                }}>
                                    <div>
                                        <strong>{new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                                        <span style={{ marginLeft: '1rem', color: 'var(--text-light)' }}>
                                            {slot.startTime} - {slot.endTime}
                                        </span>
                                        {slot.Booking && (
                                            <span style={{ marginLeft: '1rem', fontWeight: '600', color: '#3B82F6' }}>
                                                📌 {slot.Booking.ceremonyType}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: slot.slotType === 'booked' ? '#3B82F6' : slot.slotType === 'blocked' ? '#EF4444' : '#10B981',
                                            color: 'white'
                                        }}>
                                            {slot.slotType.toUpperCase()}
                                        </span>
                                        {slot.slotType !== 'booked' && (
                                            <button onClick={() => setConfirmDeleteSlot(slot.id)} style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#EF4444'
                                            }}>
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Revenue Section */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <DollarSign size={24} color="var(--primary)" />
                            Revenue Tracking
                        </h3>
                        <select
                            value={revenuePeriod}
                            onChange={(e) => setRevenuePeriod(e.target.value)}
                            className="input"
                            style={{ width: 'auto', padding: '0.5rem', marginBottom: 0 }}
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
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Earnings (75% from bookings)</div>
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
                                    <div>{b.address}</div>
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#10B981', fontWeight: '600' }}>
                                        You'll receive: ₹{b.remainingAmount || Math.round(b.totalAmount * 0.75)}
                                    </span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0 }}>All Requests</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['ceremonies', 'doshas', 'epujas'].map(type => (
                            <button
                                key={type}
                                onClick={() => setBookingType(type)}
                                className={`btn ${bookingType === type ? 'btn-primary' : 'btn-outline'}`}
                                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                            >
                                {type === 'ceremonies' ? '🕉️ Ceremonies' : type === 'doshas' ? '⭐ Doshas' : '📹 e-Pujas'}
                                <span style={{ marginLeft: '0.5rem', background: bookingType === type ? 'rgba(255,255,255,0.2)' : '#E5E7EB', padding: '0.1rem 0.4rem', borderRadius: '10px', fontSize: '0.75rem' }}>
                                    {type === 'ceremonies' ? bookings.length : type === 'doshas' ? doshaBookings.length : epujaBookings.length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ceremonies Table */}
                {bookingType === 'ceremonies' && (
                    bookings.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No ceremony requests yet.</p>
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
                                        <th style={{ padding: '0.75rem' }}>Your Earning</th>
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
                                            <td style={{ padding: '0.75rem' }}>{b.address}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div>{b.User?.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{b.User?.phone}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600',
                                                    background: b.status === 'accepted' ? '#D1FAE5' : b.status === 'completed' ? '#DBEAFE' : b.status === 'rejected' ? '#FEE2E2' : b.status === 'cancelled' ? '#F3F4F6' : '#FEF3C7',
                                                    color: b.status === 'accepted' ? '#065F46' : b.status === 'completed' ? '#1E40AF' : b.status === 'rejected' ? '#991B1B' : b.status === 'cancelled' ? '#6B7280' : '#92400E'
                                                }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', fontWeight: '600', color: '#10B981' }}>
                                                ₹{b.remainingAmount || Math.round((b.totalAmount || b.amount) * 0.75)}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {b.status === 'pending' && (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button onClick={() => updateBookingStatus(b.id, 'accepted')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                                            <CheckCircle size={14} /> Accept
                                                        </button>
                                                        <button onClick={() => updateBookingStatus(b.id, 'rejected')} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                                            <XCircle size={14} /> Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {b.status === 'accepted' && (
                                                    <button onClick={() => updateBookingStatus(b.id, 'completed')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                                        Mark Complete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* Doshas Table */}
                {bookingType === 'doshas' && (
                    doshaBookings.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No dosha puja requests assigned to you yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                                        <th style={{ padding: '0.75rem' }}>Dosha</th>
                                        <th style={{ padding: '0.75rem' }}>Customer</th>
                                        <th style={{ padding: '0.75rem' }}>Scheduled</th>
                                        <th style={{ padding: '0.75rem' }}>Mode</th>
                                        <th style={{ padding: '0.75rem' }}>Status</th>
                                        <th style={{ padding: '0.75rem' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doshaBookings.map(b => (
                                        <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div style={{ fontWeight: '500' }}>{b.Dosha?.name || 'Dosha Puja'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{b.pricingTier}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div>{b.fullName}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{b.mobile}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {b.scheduledDate ? (
                                                    <>
                                                        <div>{b.scheduledDate}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{b.scheduledTime || '-'}</div>
                                                    </>
                                                ) : <span style={{ color: 'var(--text-light)' }}>Not scheduled</span>}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{b.mode?.replace(/-/g, ' ')}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600',
                                                    background: b.status === 'scheduled' ? '#D1FAE5' : b.status === 'completed' ? '#DBEAFE' : '#FEF3C7',
                                                    color: b.status === 'scheduled' ? '#065F46' : b.status === 'completed' ? '#1E40AF' : '#92400E'
                                                }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', fontWeight: '600', color: '#10B981' }}>
                                                ₹{b.totalAmount || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* e-Pujas Table */}
                {bookingType === 'epujas' && (
                    epujaBookings.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No e-puja requests assigned to you yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                                        <th style={{ padding: '0.75rem' }}>Puja</th>
                                        <th style={{ padding: '0.75rem' }}>Customer</th>
                                        <th style={{ padding: '0.75rem' }}>Date</th>
                                        <th style={{ padding: '0.75rem' }}>Status</th>
                                        <th style={{ padding: '0.75rem' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {epujaBookings.map(b => (
                                        <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div style={{ fontWeight: '500' }}>{b.pujaName || b.EPuja?.name || 'e-Puja'}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div>{b.fullName}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{b.mobile}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {b.pujaDate || <span style={{ color: 'var(--text-light)' }}>TBD</span>}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600',
                                                    background: b.status === 'scheduled' ? '#D1FAE5' : b.status === 'completed' ? '#DBEAFE' : '#FEF3C7',
                                                    color: b.status === 'scheduled' ? '#065F46' : b.status === 'completed' ? '#1E40AF' : '#92400E'
                                                }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', fontWeight: '600', color: '#10B981' }}>
                                                ₹{b.totalAmount || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* Profile Edit Modal */}
            {
                showProfileModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Edit Profile</h3>
                                <button onClick={() => setShowProfileModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <XCircle size={24} color="#6B7280" />
                                </button>
                            </div>

                            {profileSuccess && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{profileSuccess}</div>}
                            {profileError && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{profileError}</div>}

                            <form onSubmit={handleUpdateProfile}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="label">Full Name</label>
                                        <input
                                            type="text" className="input" required
                                            value={profileForm.name}
                                            onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Phone</label>
                                        <input
                                            type="tel" className="input" required
                                            value={profileForm.phone}
                                            onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <label className="label">Photo URL</label>
                                <input
                                    type="url" className="input" placeholder="https://example.com/your-photo.jpg"
                                    value={profileForm.photo}
                                    onChange={e => setProfileForm({ ...profileForm, photo: e.target.value })}
                                />
                                {profileForm.photo && (
                                    <img
                                        src={profileForm.photo}
                                        alt="Preview"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginBottom: '1rem', border: '2px solid #ddd' }}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}

                                <label className="label">Bio / About Me</label>
                                <textarea
                                    className="input" rows="3" placeholder="Tell users about yourself..."
                                    value={profileForm.bio}
                                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="label">Experience (Years)</label>
                                        <input
                                            type="number" className="input" required min="0"
                                            value={profileForm.experience}
                                            onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Specialization</label>
                                        <input
                                            type="text" className="input" required
                                            value={profileForm.specialization}
                                            onChange={e => setProfileForm({ ...profileForm, specialization: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowProfileModal(false)} className="btn btn-outline">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default PanditDashboard;
