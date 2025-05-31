import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, DollarSign, X } from 'lucide-react';
import bookingService from '../services/booking.service';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getUserBookings();
      // Convert totalPrice to number for each booking
      const processedData = data.map(booking => ({
        ...booking,
        totalPrice: Number(booking.totalPrice)
      }));
      setBookings(processedData);
      setError('');
    } catch (err) {
      setError('Failed to load your bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (showTime) => {
    return new Date(showTime) > new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">My Bookings</h2>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-6">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-gray-800 rounded-lg p-6 space-y-4 ${
                !isUpcoming(booking.showTime) ? 'opacity-75' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {booking.movie?.name}
                    </h3>
                    {!isUpcoming(booking.showTime) && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        Past
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={16} />
                      <span>Booked on: {formatDate(booking.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock size={16} />
                      <span>Show Time: {booking.showTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users size={16} />
                      <span>
                        {booking.adultCount} Adult{booking.adultCount !== 1 && 's'}, 
                        {booking.childCount} Child{booking.childCount !== 1 && 'ren'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="font-semibold">Seats:</span>
                      <span>
                        {booking.seats?.map(seat => `R${seat.seatRow}C${seat.seatColumn}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {isUpcoming(booking.showTime) && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                    title="Cancel Booking"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="flex justify-end items-center pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-white">
                  <DollarSign size={16} />
                  <span className="font-semibold">
                    {typeof booking.totalPrice === 'number' 
                      ? booking.totalPrice.toFixed(2) 
                      : Number(booking.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings; 