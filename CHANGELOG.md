# Changelog

## [1.0.0] - 2024

### Added
- Complete ticket booking system implementation
  - Ticket quantity selection for adults and children
  - Age-based pricing (children get 50% discount)
  - Showtime selection functionality
  - Seat selection system
  - Booking confirmation flow
  - Booking management for users and admins

- Database Schema
  - Users table for authentication and user management
  - Movies table for movie information and showtimes
  - Bookings table for ticket reservations
  - Seats table for seat management and availability

- Authentication System
  - User registration and login
  - JWT-based authentication
  - Admin role management
  - Protected routes for authenticated users

- Admin Panel Features
  - Movie management (CRUD operations)
  - Booking management
  - User overview
  - Showtime management

- User Features
  - Movie browsing and search
  - Ticket booking with seat selection
  - Booking history
  - Profile management

### Database Tables

#### Users
```sql
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Movies
```sql
CREATE TABLE Movies (
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
```

#### Bookings
```sql
CREATE TABLE Bookings (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    movieId INTEGER NOT NULL,
    showTime VARCHAR(255) NOT NULL,
    adultCount INTEGER NOT NULL,
    childCount INTEGER NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (movieId) REFERENCES Movies(id) ON DELETE NO ACTION
);
```

#### Seats
```sql
CREATE TABLE Seats (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    bookingId INTEGER NOT NULL,
    movieId INTEGER NOT NULL,
    seatRow INTEGER NOT NULL,
    seatColumn INTEGER NOT NULL,
    isOccupied BOOLEAN NOT NULL DEFAULT true,
    showTime VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (movieId) REFERENCES Movies(id) ON DELETE NO ACTION
);
```

### Technical Improvements
- Implemented proper TypeScript types and interfaces
- Added Sequelize model associations
- Enhanced error handling and validation
- Improved API response formats
- Added proper JWT token handling
- Implemented secure password hashing
- Added database indexing for better performance

### UI/UX Improvements
- Responsive design for all screen sizes
- Modern and intuitive booking interface
- Interactive seat selection
- Clear booking confirmation process
- Enhanced admin dashboard
- Improved error messages and user feedback
- Loading states and animations

## [Unreleased]

### Added
- Ticket booking system implementation
  - Added ticket quantity selection for adults and children
  - Implemented age-based pricing (children get 50% discount)
  - Added showtime selection functionality
  - Integrated with existing movie details modal
- New database table 'Bookings' to store ticket reservations
  - Tracks adult and child ticket quantities
  - Records selected showtime
  - Stores total price
  - Links to user and movie

### Changed
- Enhanced MovieDetailsModal to include ticket booking functionality
- Updated UI to show pricing breakdown for adults and children
- Added booking confirmation flow

### Technical Details
- Created new BookingModal component
- Added state management for ticket quantities
- Implemented price calculation logic
- Added validation for ticket selection
- Created database migration for Bookings table 