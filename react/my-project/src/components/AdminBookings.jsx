import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, Clock, X, DollarSign } from 'lucide-react';
import bookingService from '../services/booking.service';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all'); // all, today, upcoming, past

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching bookings...');
      
      // Log auth status
      const currentUser = JSON.parse(localStorage.getItem('user'));
      console.log('Current user:', {
        email: currentUser?.user?.email,
        isAdmin: currentUser?.user?.isAdmin
      });

      const data = await bookingService.getAllBookings();
      console.log('Raw bookings data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Received data is not an array:', data);
        setError('Invalid data format received');
        return;
      }

      console.log('Number of bookings received:', data.length);

      // Convert totalPrice to number for each booking
      const processedData = data.map(booking => {
        console.log('Processing booking:', {
          id: booking.id,
          movieName: booking.Movie?.name,
          userEmail: booking.User?.email,
          totalPrice: booking.totalPrice,
          seatsCount: booking.seats?.length
        });
        return {
          ...booking,
          totalPrice: Number(booking.totalPrice),
          Movie: booking.Movie || null,
          User: booking.User || null,
          seats: booking.seats || []
        };
      });
      
      console.log('Final processed bookings:', processedData.length);
      setBookings(processedData);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      setError('Failed to delete booking');
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

  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      // Search filter
      const searchMatch = 
        booking.Movie?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.User?.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter
      const bookingDate = new Date(booking.showTime);
      let dateMatch = true;

      switch (filterDate) {
        case 'today':
          dateMatch = bookingDate.toDateString() === now.toDateString();
          break;
        case 'upcoming':
          dateMatch = bookingDate > now;
          break;
        case 'past':
          dateMatch = bookingDate < now;
          break;
        default:
          dateMatch = true;
      }

      return searchMatch && dateMatch;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Booking Management</h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by movie or customer email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {booking.Movie?.name}
                </h3>
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

              <button
                onClick={() => handleDelete(booking.id)}
                className="p-2 text-red-500 hover:text-red-400 transition-colors"
                title="Delete Booking"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <div className="text-gray-300">
                <span className="text-gray-400">Customer: </span>
                {booking.User?.email}
              </div>
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

        {filteredBookings.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No bookings found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings; 