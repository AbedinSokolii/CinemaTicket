import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import SeatSelection from './SeatSelection';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const BookingModal = ({ isOpen, onClose, movie }) => {
    const [step, setStep] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [ticketCounts, setTicketCounts] = useState({
        adult: 0,
        child: 0
    });
    const [loading, setLoading] = useState(false);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const handleClose = () => {
        setStep(1);
        setSelectedSeats([]);
        setTicketCounts({ adult: 0, child: 0 });
        onClose();
    };

    const handleConfirm = async () => {
        try {
            console.log('Starting booking confirmation with seats:', selectedSeats);
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                toast.error('Please login to book tickets');
                return;
            }

            const showTime = movie.showTime || movie.showTimes[0];
            const totalPrice = (ticketCounts.adult * adultPrice + ticketCounts.child * childPrice).toFixed(2);

            // Validate seat selection
            if (!selectedSeats || selectedSeats.length === 0) {
                toast.error('Please select your seats before confirming');
                return;
            }

            if (selectedSeats.length !== totalTickets) {
                toast.error(`Please select exactly ${totalTickets} seats`);
                return;
            }

            // Check seat availability first
            const availabilityResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/seats/${movie.id}/${encodeURIComponent(showTime)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const occupiedSeats = availabilityResponse.data;
            const seatConflicts = selectedSeats.filter(selected => 
                occupiedSeats.some(occupied => 
                    occupied.seatRow === selected.row && 
                    occupied.seatColumn === selected.column
                )
            );

            if (seatConflicts.length > 0) {
                toast.error('Some selected seats are no longer available. Please choose different seats.');
                return;
            }

            // Create booking
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/bookings`,
                {
                    movieId: movie.id,
                    showTime,
                    adultCount: ticketCounts.adult,
                    childCount: ticketCounts.child,
                    totalPrice: parseFloat(totalPrice),
                    seats: selectedSeats.map(seat => ({
                        seatRow: seat.row,
                        seatColumn: seat.column
                    }))
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Show success notification
            toast.success('Booking successful! Thank you for your purchase.', {
                duration: 4000,
                position: 'top-center',
            });
            
            // Close the modal and reset state
            handleClose();
        } catch (error) {
            console.error('Booking error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to complete booking. Please try again.';
            toast.error(errorMessage);
            
            // If seats were taken, refresh the seat selection
            if (error.response?.status === 409) {
                // TODO: Implement seat selection refresh
            }
        } finally {
            setLoading(false);
        }
    };

    const totalTickets = ticketCounts.adult + ticketCounts.child;
    const adultPrice = parseFloat(movie?.price?.replace('$', '') || 0);
    const childPrice = adultPrice * 0.5; // 50% discount for children
    const totalPrice = (ticketCounts.adult * adultPrice + ticketCounts.child * childPrice).toFixed(2);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="div" className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        {step === 1 ? 'Select Tickets' : 'Choose Seats'}
                                    </h3>
                                    <button
                                        type="button"
                                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={handleClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </Dialog.Title>

                                {step === 1 ? (
                                    <div className="mt-4">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium">Adult</h4>
                                                    <p className="text-sm text-gray-500">${adultPrice}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        className="px-3 py-1 border rounded-md"
                                                        onClick={() => setTicketCounts(prev => ({
                                                            ...prev,
                                                            adult: Math.max(0, prev.adult - 1)
                                                        }))}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{ticketCounts.adult}</span>
                                                    <button
                                                        className="px-3 py-1 border rounded-md"
                                                        onClick={() => setTicketCounts(prev => ({
                                                            ...prev,
                                                            adult: prev.adult + 1
                                                        }))}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium">Child</h4>
                                                    <p className="text-sm text-gray-500">${childPrice}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        className="px-3 py-1 border rounded-md"
                                                        onClick={() => setTicketCounts(prev => ({
                                                            ...prev,
                                                            child: Math.max(0, prev.child - 1)
                                                        }))}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{ticketCounts.child}</span>
                                                    <button
                                                        className="px-3 py-1 border rounded-md"
                                                        onClick={() => setTicketCounts(prev => ({
                                                            ...prev,
                                                            child: prev.child + 1
                                                        }))}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex justify-between text-lg font-medium">
                                                <span>Total</span>
                                                <span>${totalPrice}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="mt-4 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 disabled:bg-gray-400"
                                                onClick={() => setStep(2)}
                                                disabled={totalTickets === 0}
                                            >
                                                Continue to Seat Selection
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <SeatSelection
                                            movie={movie}
                                            requiredSeats={totalTickets}
                                            onSeatSelect={setSelectedSeats}
                                            selectedSeats={selectedSeats}
                                        />
                                        <div className="mt-4 flex justify-between">
                                            <button
                                                type="button"
                                                className="bg-gray-200 text-gray-800 rounded-md py-2 px-4 hover:bg-gray-300"
                                                onClick={() => setStep(1)}
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 disabled:bg-gray-400"
                                                onClick={handleConfirm}
                                                disabled={selectedSeats.length !== totalTickets || loading}
                                            >
                                                {loading ? 'Confirming...' : 'Confirm Booking'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default BookingModal; 