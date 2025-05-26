-- Switch to the kinema database
USE kinema;

-- Add isAdmin column to Users table if it doesn't exist
ALTER TABLE Users
ADD COLUMN IF NOT EXISTS isAdmin BOOLEAN NOT NULL DEFAULT false;

-- Update an existing user to be an admin (replace 'admin@example.com' with the email of the user you want to make admin)
-- If you want to make a specific user an admin, replace 'admin@example.com' with their email
UPDATE Users
SET isAdmin = true
WHERE email = 'admin@example.com';

-- Alternatively, you can create a new admin user (uncomment and modify the following lines)
/*
INSERT INTO Users (firstName, lastName, email, password, isAdmin)
VALUES (
    'Admin',
    'User',
    'admin@example.com',
    '$2a$10$YourHashedPasswordHere', -- You'll need to generate this using bcrypt
    true
);
*/ 