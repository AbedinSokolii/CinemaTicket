import authService from './auth.service';

const API_URL = 'http://localhost:3002';

export interface Movie {
    id?: number;
    name: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    price: string;
    duration: string;
    rating: number;
    showTimes: string[];
    releaseDate: string; // Use string for ISO date compatibility
}

class MovieService {
    async getMovies(): Promise<Movie[]> {
        const response = await fetch(`${API_URL}/movies`);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        return response.json();
    }

    async getTopRatedMovies(): Promise<Movie[]> {
        const response = await fetch(`${API_URL}/movies/top`);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        return response.json();
    }
    
    async commingSoon(): Promise<Movie[]> {
        const response = await fetch(`${API_URL}/movies/soon`);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        return response.json();
    }

    async createMovie(movie: Movie): Promise<Movie> {
        const currentUser = authService.getCurrentUser();
        const response = await fetch(`${API_URL}/movies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(currentUser?.token && { 'Authorization': `Bearer ${currentUser.token}` })
            },
            body: JSON.stringify(movie)
        });
        if (!response.ok) {
            let errorText = 'Failed to create movie';
            try {
                const error = await response.json();
                errorText = error.message || errorText;
            } catch {}
            throw new Error(errorText);
        }
        return response.json();
    }

    async updateMovie(id: number, movie: Partial<Movie>): Promise<Movie> {
        const currentUser = authService.getCurrentUser();
        const response = await fetch(`${API_URL}/movies/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(currentUser?.token && { 'Authorization': `Bearer ${currentUser.token}` })
            },
            body: JSON.stringify(movie)
        });
        if (!response.ok) {
            let errorText = 'Failed to update movie';
            try {
                const error = await response.json();
                errorText = error.message || errorText;
            } catch {}
            throw new Error(errorText);
        }
        return response.json();
    }

    async deleteMovie(id: number): Promise<void> {
        const currentUser = authService.getCurrentUser();
        const response = await fetch(`${API_URL}/movies/${id}`, {
            method: 'DELETE',
            headers: {
                ...(currentUser?.token && { 'Authorization': `Bearer ${currentUser.token}` })
            }
        });
        if (!response.ok) {
            let errorText = 'Failed to delete movie';
            try {
                const error = await response.json();
                errorText = error.message || errorText;
            } catch {}
            throw new Error(errorText);
        }
    }
}

export default new MovieService();