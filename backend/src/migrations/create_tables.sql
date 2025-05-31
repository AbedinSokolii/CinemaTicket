-- Use the correct database
USE kinema;

-- Drop tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS Seats;
DROP TABLE IF EXISTS Bookings;

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

-- Seats table with correct column names
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