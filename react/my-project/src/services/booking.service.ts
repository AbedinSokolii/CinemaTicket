import axios from 'axios';
import authService from './auth.service';

const API_URL = 'http://localhost:3002/api/bookings';

export interface BookingDetails {
    movieId: number;
    showTime: string;
    adultCount: number;
    childCount: number;
    totalPrice: number;
    seats: Array<{
        seatRow: number;
        seatColumn: number;
    }>;
}

class BookingService {
    async createBooking(bookingDetails: BookingDetails) {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(API_URL, bookingDetails, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        return response.data;
    }

    async getUserBookings() {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${API_URL}/user`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        return response.data;
    }

    async getAllBookings() {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.token) {
            throw new Error('No authentication token found');
        }

        if (!currentUser.user?.isAdmin) {
            throw new Error('Admin access required');
        }

        const response = await axios.get(`${API_URL}/admin/all`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        return response.data;
    }

    async cancelBooking(bookingId: number) {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.delete(`${API_URL}/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        return response.data;
    }
}

export default new BookingService(); 