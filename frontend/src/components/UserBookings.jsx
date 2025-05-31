import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to view bookings');
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/bookings/user`,
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

    const handleCancelBooking = async (bookingId) => {
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

            toast.success('Booking cancelled successfully');
            fetchBookings(); // Refresh the list
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error('Failed to cancel booking');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No bookings found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow p-4 border border-gray-200"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">{booking.movie.name}</h3>
                            <p className="text-gray-600">{booking.showTime}</p>
                            <div className="mt-2">
                                <p>Tickets: {booking.adultCount + booking.childCount}</p>
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
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserBookings; 