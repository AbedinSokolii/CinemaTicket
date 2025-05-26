import User from '../resources/user/model'
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import { AUTH_CONFIG } from "../config/auth.config";
import { Request, Response, NextFunction } from 'express'

interface JwtPayload {
    id: number;
}

export const newToken = (user: any) => {
    const secret: Secret = AUTH_CONFIG.jwtSecret;
    const options: SignOptions = { expiresIn: AUTH_CONFIG.jwtExpiresIn };
    return jwt.sign({ id: user.id }, secret, options);
};

export const verifyToken = (token: string): Promise<JwtPayload> => {
    const secret: Secret = AUTH_CONFIG.jwtSecret;
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, payload) => {
            if (err) return reject(err)
            resolve(payload as JwtPayload)
        })
    })
}

export const signup = async (req: Request, res: Response) => {
    try {
        // Validate input
        const { email, password, firstName, lastName } = req.body
        
        if (!email || !password || !firstName) {
            return res.status(400).json({ 
                message: 'Required fields missing',
                required: ['email', 'password', 'firstName']
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, AUTH_CONFIG.saltRounds)

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        })

        // Generate token
        const token = newToken(user)
        
        return res.status(201).json({ 
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin
            }
        })
    } catch (e) {
        console.error('Signup error:', e)
        return res.status(500).json({ message: 'Internal server error during signup' })
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required',
                required: ['email', 'password']
            })
        }

        // Find user
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Generate token
        const token = newToken(user)
        
        return res.status(200).json({ 
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin
            }
        })
    } catch (e) {
        console.error('Signin error:', e)
        return res.status(500).json({ message: 'Internal server error during signin' })
    }
}

// Middleware to protect routes
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = bearer.split('Bearer ')[1].trim()
    
    try {
        const payload = await verifyToken(token)
        const user = await User.findByPk(payload.id)
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' })
        }
        
        req.user = user
        next()
    } catch (e) {
        console.error('Auth middleware error:', e)
        return res.status(401).json({ message: 'Invalid token' })
    }
}
