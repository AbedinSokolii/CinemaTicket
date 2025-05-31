import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeatSelection = ({ movie, requiredSeats, onSeatSelect, selectedSeats }) => {
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [error, setError] = useState(null);

    const rows = 9;
    const columns = 19;

    const fetchOccupiedSeats = async () => {
        try {
            // Debug log
            console.log('Movie data:', movie);
            console.log('Show time:', movie?.showTime);
            
            if (!movie?.id || !movie?.showTime) {
                setError('Invalid movie data');
                return;
            }

            // Encode the showTime properly for the URL
            const encodedShowTime = encodeURIComponent(movie.showTime);
            
            // Debug log
            console.log('Fetching seats from:', `${import.meta.env.VITE_API_URL}/api/seats/${movie.id}/${encodedShowTime}`);
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/seats/${movie.id}/${encodedShowTime}`);
            
            // Debug log
            console.log('Response:', response.data);
            
            setOccupiedSeats(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching occupied seats:', error);
            setError(error.response?.data?.message || 'Failed to load seat information');
            setOccupiedSeats([]);
        }
    };

    useEffect(() => {
        if (movie?.id && movie?.showTime) {
            fetchOccupiedSeats();
        }
    }, [movie]);

    const isSeatOccupied = (row, column) => {
        return occupiedSeats.some(seat => seat.seatRow === row && seat.seatColumn === column);
    };

    const isSeatSelected = (row, column) => {
        return selectedSeats.some(seat => seat.row === row && seat.column === column);
    };

    const handleSeatClick = (row, column) => {
        if (isSeatOccupied(row, column)) return;

        console.log('Handling seat click:', { row, column });
        console.log('Current selected seats:', selectedSeats);

        const seatIndex = selectedSeats.findIndex(
            seat => seat.row === row && seat.column === column
        );

        if (seatIndex > -1) {
            // Deselect seat
            const newSelectedSeats = selectedSeats.filter((_, index) => index !== seatIndex);
            console.log('Deselecting seat, new selection:', newSelectedSeats);
            onSeatSelect(newSelectedSeats);
        } else if (selectedSeats.length < requiredSeats) {
            // Select seat
            const newSelectedSeats = [...selectedSeats, { row, column }];
            console.log('Selecting seat, new selection:', newSelectedSeats);
            onSeatSelect(newSelectedSeats);
        }
    };

    const getSeatColor = (row, column) => {
        if (isSeatOccupied(row, column)) return 'bg-gray-500'; // Occupied
        if (isSeatSelected(row, column)) return 'bg-green-500'; // Selected
        return 'bg-blue-500'; // Available
    };

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                <p>{error}</p>
                <button 
                    onClick={fetchOccupiedSeats}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-max">
                {/* Screen */}
                <div className="w-full h-8 bg-gray-300 rounded-lg mb-8 text-center text-sm text-gray-600 flex items-center justify-center">
                    Screen
                </div>

                {/* Seats */}
                <div className="grid gap-2">
                    {Array.from({ length: rows }, (_, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-2">
                            {Array.from({ length: columns }, (_, colIndex) => (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`w-6 h-6 rounded-t-lg ${getSeatColor(rowIndex + 1, colIndex + 1)} 
                                        ${isSeatOccupied(rowIndex + 1, colIndex + 1) ? 'cursor-not-allowed' : 'hover:opacity-75 cursor-pointer'}`}
                                    onClick={() => handleSeatClick(rowIndex + 1, colIndex + 1)}
                                    disabled={isSeatOccupied(rowIndex + 1, colIndex + 1)}
                                    title={`Row ${rowIndex + 1}, Seat ${colIndex + 1}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-6 flex justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-t-lg" />
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-t-lg" />
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-500 rounded-t-lg" />
                        <span>Occupied</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection; 