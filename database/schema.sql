-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS kinema;
USE kinema;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE IF NOT EXISTS Movies (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    imageSrc VARCHAR(1024) NOT NULL,
    imageAlt VARCHAR(255) NOT NULL,
    price VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    rating FLOAT NOT NULL DEFAULT 0,
    showTimes JSON NOT NULL,
    releaseDate DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS Bookings (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    movieId INTEGER NOT NULL,
    showTime VARCHAR(50) NOT NULL,
    adultCount INTEGER NOT NULL,
    childCount INTEGER NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (movieId) REFERENCES Movies(id) ON DELETE CASCADE
);

-- Seats table
CREATE TABLE IF NOT EXISTS Seats (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    bookingId INTEGER NOT NULL,
    movieId INTEGER NOT NULL,
    seatRow INTEGER NOT NULL,
    seatColumn INTEGER NOT NULL,
    isOccupied BOOLEAN NOT NULL DEFAULT true,
    showTime VARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (movieId) REFERENCES Movies(id) ON DELETE CASCADE,
    -- Add unique constraint to prevent double booking
    UNIQUE KEY unique_seat_booking (movieId, showTime, seatRow, seatColumn)
);

-- Add indexes for better query performance
CREATE INDEX idx_movie_showtime ON Seats(movieId, showTime);
CREATE INDEX idx_booking_seats ON Seats(bookingId);
CREATE INDEX idx_user_bookings ON Bookings(userId);
CREATE INDEX idx_movie_bookings ON Bookings(movieId);

-- Insert an admin user (password: admin123)
INSERT INTO Users (firstName, lastName, email, password, isAdmin)
VALUES ('Admin', 'User', 'admin@kinema.com', '$2b$10$YourHashedPasswordHere', true);

-- Example movie data
INSERT INTO Movies (name, description, imageSrc, imageAlt, price, duration, rating, showTimes, releaseDate)
VALUES (
    'Example Movie',
    'This is an example movie description.',
    'https://example.com/movie-poster.jpg',
    'Example Movie Poster',
    '$12.99',
    '120 min',
    4.5,
    '["10:00 AM", "2:00 PM", "6:00 PM", "9:00 PM"]',
    '2024-03-20 00:00:00'
); 