import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const SeatSelection = ({ movie, showTime, requiredSeats, onCancel, sendDataToModal }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [error, setError] = useState('');
  
  // Update these constants to match database constraints
  const ROWS = 4;     // Maximum allowed in database
  const COLUMNS = 5;   // Keep this the same

  useEffect(() => {
    // Fetch occupied seats for this movie and showtime
    const fetchOccupiedSeats = async () => {
      try {
        const response = await fetch(`http://localhost:3002/seats/${movie.id}/${encodeURIComponent(movie.selectedTime)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch occupied seats');
        }
        const data = await response.json(); 
        setOccupiedSeats(data);
      } catch (err) {
        console.error('Error fetching occupied seats:', err);
        setError('Failed to load seat information. Please try again.');
      }
    };

    fetchOccupiedSeats();
  }, [movie, showTime]);

  const handleSeatClick = (row, col) => {
    const seatKey = `${row}-${col}`;

    // Check if seat is occupied
    if (occupiedSeats.some(seat => seat.seatRow === row && seat.seatRow === col)) {
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatKey)) {
        return prev.filter(seat => seat !== seatKey);
      }
      if (prev.length >= requiredSeats) {
        return prev;
      }
      return [...prev, seatKey];
    });
  };

  const handleConfirm = () => {
    const selected = selectedSeats.map(seat => {
      const selected = seat.split('-');
      return selected[selected.length - 1];
    });
    sendDataToModal(selected)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-Nav_bar rounded-xl p-6 w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Select Your Seats</h2>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-600 rounded"></div>
            <span className="text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded"></div>
            <span className="text-gray-300">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
              <X size={14} className="text-gray-400" />
            </div>
            <span className="text-gray-300">Occupied</span>
          </div>
        </div>

        {/* Screen */}
        <div className="w-full bg-gray-700 h-2 rounded-full mb-8 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
            Screen
          </div>
        </div>

        {/* Seats Grid */}
        <div className="grid gap-4 mb-6 overflow-x-auto">
          {Array.from({ length: Math.ceil(ROWS * COLUMNS / 5) }, (_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {Array.from({ length: 5 }, (_, colIndex) => {
                // Calculate the global seat number
                const seatNumber = rowIndex * 5 + colIndex + 1;
                const row = Math.floor((seatNumber - 1) / COLUMNS); // Get the row index based on seat number
                const col = (seatNumber - 1) % COLUMNS; // Get the column index based on seat number
                const seatKey = `${row + 1}-${col + 1}`;
                const isSelected = selectedSeats.includes(seatKey);
                
                const isOccupied = occupiedSeats.some(seat => seat.seatNumber === seatNumber);
                
                return (
                  seatNumber <= ROWS * COLUMNS && (
                    <button
                      key={seatNumber}
                      onClick={() => handleSeatClick(row + 1, col + 1)}
                      disabled={isOccupied}
                      className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${isOccupied
                          ? 'bg-gray-800 cursor-not-allowed'
                          : isSelected
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                    >
                      {isOccupied ? (
                        <X size={14} className="text-gray-400" />
                      ) : isSelected ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <span className="text-gray-300 text-sm">{seatNumber}</span>
                      )}
                    </button>
                  )
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          // disabled={selectedSeats.length !== requiredSeats}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Seats
        </button>
      </div>
    </motion.div>
  );
};

export default SeatSelection; 