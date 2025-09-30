import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Clock, Users } from 'lucide-react';
import SeatSelection from './SeatSelection';

const BookingModal = ({ movie, onClose }) => {
  const [step, setStep] = useState(1); // 1: Quantity, 2: Seats
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  console.log("booking -> ", movie);

  // Extract numeric price value from movie.price (removes $ sign)
  const basePrice = parseFloat(movie?.price.replace('$', ''));

  // Calculate total price (children get 50% discount)
  const totalPrice = (adultCount * basePrice) + (childCount * basePrice * 0.5);

  const handleIncrement = (type) => {
    if (type === 'adult') {
      setAdultCount(prev => prev + 1);
    } else {
      setChildCount(prev => prev + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === 'adult') {
      setAdultCount(prev => prev > 0 ? prev - 1 : 0);
    } else {
      setChildCount(prev => prev > 0 ? prev - 1 : 0);
    }
  };

  const handleQuantityConfirm = () => {
    if (adultCount + childCount === 0) {
      alert('Please select at least one ticket');
      return;
    }
    setStep(2);
  };

  const handleSeatConfirm = (seats) => {
    setSelectedSeats(seats);
    onConfirm({
      adultCount,
      childCount,
      totalPrice,
      showTime: selectedTime,
      movieId: movie.id,
      movieName: movie.name,
      seats: seats.map(seat => ({
        seatRow: seat.seatRow,
        seatColumn: seat.seatColumn
      }))
    });
  };

  if (step === 2) {
    return (
      <SeatSelection
        movieId={movie.id}
        showTime={selectedTime}
        requiredSeats={adultCount + childCount}
        onConfirm={handleSeatConfirm}
        onCancel={() => setStep(1)}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 bg-black/90  rounded-xl p-6 w-full max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Book Tickets</h2>

        {/* Movie Info */}
        <div className="mb-6">
          <h3 className="text-lg text-white mb-2">{movie?.name}</h3>
          <div className="flex items-center gap-2 text-gray-300">
            <Clock size={16} />
            <span>{movie.selectedTime}</span>
          </div>
        </div>

        {/* Ticket Selection */}
        <div className="space-y-4 mb-6">
          {/* Adult Tickets */}
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Adult</h4>
              <p className="text-gray-400 text-sm">${basePrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDecrement('adult')}
                className="text-white p-1 hover:bg-gray-700 rounded"
                disabled={adultCount === 0}
              >
                <Minus size={20} />
              </button>
              <span className="text-white w-8 text-center">{adultCount}</span>
              <button
                onClick={() => handleIncrement('adult')}
                className="text-white p-1 hover:bg-gray-700 rounded"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Child Tickets */}
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Child</h4>
              <p className="text-gray-400 text-sm">${(basePrice * 0.5).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDecrement('child')}
                className="text-white p-1 hover:bg-gray-700 rounded"
                disabled={childCount === 0}
              >
                <Minus size={20} />
              </button>
              <span className="text-white w-8 text-center">{childCount}</span>
              <button
                onClick={() => handleIncrement('child')}
                className="text-white p-1 hover:bg-gray-700 rounded"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-700 pt-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Total Tickets</span>
            <div className="flex items-center gap-2 text-white">
              <Users size={16} />
              <span>{adultCount + childCount}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total Price</span>
            <span className="text-white font-bold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <SeatSelection />
        
        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleQuantityConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
            disabled={adultCount + childCount === 0}
          >
            Select Seats
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal; 