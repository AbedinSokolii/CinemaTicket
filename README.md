inside the folder you have a read me check there 
![Last Commit](https://img.shields.io/github/last-commit/AbedinSokolii/desktop-tutorial)
![Top Language](https://img.shields.io/github/languages/top/AbedinSokolii/desktop-tutorial?logo=javascript)
![Languages](https://img.shields.io/badge/languages-4-blue)

![Express](https://img.shields.io/badge/express.js-%23404d59.svg?logo=express&logoColor=white)
![JSON](https://img.shields.io/badge/json-%23000000.svg?logo=json&logoColor=white)
![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?logo=markdown&logoColor=white)
![npm](https://img.shields.io/badge/npm-%23CB3837.svg?logo=npm&logoColor=white)
![autoprefixer](https://img.shields.io/badge/autoprefixer-%23ffb300.svg?logo=autoprefixer&logoColor=white)
![PostCSS](https://img.shields.io/badge/postcss-%23DD3A0A.svg?logo=postcss&logoColor=white)
![.env](https://img.shields.io/badge/.env-222.svg)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?logo=javascript&logoColor=black)
![Nodemon](https://img.shields.io/badge/nodemon-76D04B?logo=nodemon&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/sequelize-52B0E7?logo=sequelize&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white)
![ts-node](https://img.shields.io/badge/ts--node-3178C6?logo=ts-node&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/eslint-%234B32C3.svg?logo=eslint&logoColor=white)
![Swiper](https://img.shields.io/badge/swiper-6332f6?logo=swiper&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-007C83?logo=date-fns&logoColor=white)



# CinemaTicket 🎬

A modern web application for booking movie tickets online. Built with React, Node.js, and MySQL.

Created by Abedin Sokoli, Aurora Selmanaj, Uron Ternava, Anesa Hoxha, Amra Durguti

## Features

- 🎥 Browse available movies with beautiful UI
- 🔍 Search movies by title or description
- 👤 User authentication (login/register)
- 🎫 View movie details and showtimes
- ⭐ Movie ratings and descriptions
- 👑 Admin panel for movie management
- 📅 Dynamic showtimes management
- 💰 Ticket pricing
- 📱 Responsive design for all devices

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v8.0 or higher)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CinemaTicket-main
```

### 2. Database Setup
1. Open MySQL Workbench
2. Create a new database named 'kinema':
```sql
CREATE DATABASE kinema;
```

3. Create the Users table:
```sql
USE kinema;

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
```

### 3. Configure Database Connection
1. Navigate to `backend/src/utils/dbConnection.ts`
2. Update the database credentials with your MySQL configuration:
```typescript
const dbName: string = 'kinema';
const dbUsername: string = 'your_username';  // Change this
const dbPassword: string = 'your_password';  // Change this
const host: string = 'localhost';
```

### 4. Install Dependencies and Start Servers

#### Backend Setup
```bash
cd backend
npm install
npm start
```
The backend server will start on http://localhost:3002

#### Frontend Setup
In a new terminal:
```bash
cd react/my-project
npm install
npm run dev
```
The frontend development server will start on http://localhost:5173

### 5. Create an Admin User
1. Register a new user through the application
2. Open MySQL Workbench and run:
```sql
UPDATE Users
SET isAdmin = true
WHERE email = 'your-email@example.com';  -- Replace with the email you registered
```

## Usage

1. **Regular Users Can:**
   - Browse available movies
   - Search for movies
   - View movie details and showtimes
   - Register/Login to book tickets

2. **Admins Can Additionally:**
   - Access the admin panel
   - Add new movies
   - Edit existing movies
   - Delete movies
   - Manage showtimes
   - Set movie prices and details

## Project Structure

- `/backend` - Node.js/Express backend
  - `/src/resources` - API resources and models
  - `/src/utils` - Utility functions and middleware

- `/react/my-project` - React frontend
  - `/src/components` - React components
  - `/src/services` - API services
  - `/src/assets` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, email your-email@example.com or open an issue in the repository.

## Authors
- **Abedin Sokoli** - Project Lead & Full Stack Development
- **Aurora Selmanaj** - Frontend Development
- **Uron Ternava** - Backend Development
- **Anesa Hoxha** - UI/UX Design
- **Amra Durguti** - Database Management

Project created in 2024


