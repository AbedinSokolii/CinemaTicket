import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, today, upcoming

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login as admin');
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/bookings/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success('Booking deleted successfully');
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Failed to delete booking');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = 
            booking.movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;

        const bookingDate = new Date(booking.showTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filter === 'today') {
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            return matchesSearch && bookingDate >= today && bookingDate <= endOfDay;
        }

        if (filter === 'upcoming') {
            return matchesSearch && bookingDate >= today;
        }

        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by movie or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="all">All Bookings</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                </select>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No bookings found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-white rounded-lg shadow p-4 border border-gray-200"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{booking.movie.name}</h3>
                                    <p className="text-gray-600">{booking.showTime}</p>
                                    <p className="text-sm text-gray-500">Booked by: {booking.user.email}</p>
                                    <div className="mt-2">
                                        <p>Adults: {booking.adultCount}</p>
                                        <p>Children: {booking.childCount}</p>
                                        <p className="font-medium">Total: ${booking.totalPrice}</p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">
                                            Seats: {booking.seats.map(seat => `R${seat.seatRow}C${seat.seatColumn}`).join(', ')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBookings; 