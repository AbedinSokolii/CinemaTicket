const API_URL = 'http://localhost:3002';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    firstName: string;
    lastName?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName?: string;
    };
    message: string;
}

class AuthService {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to login');
        }

        const result = await response.json();
        if (result.token) {
            localStorage.setItem('user', JSON.stringify(result));
        }
        return result;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to register');
        }

        const result = await response.json();
        // Don't store user data after registration
        // User needs to login explicitly
        return result;
    }

    logout(): void {
        localStorage.removeItem('user');
    }

    getCurrentUser(): AuthResponse | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }
}

export default new AuthService(); 