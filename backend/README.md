# Revister Backend

A modular Node.js backend for the Revister application with PostgreSQL database integration.

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database and configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── index.js        # Main application entry point
├── .env                # Environment variables
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Configure PostgreSQL:
   - Make sure PostgreSQL is installed and running
   - Create a database named 'revister'
   - Update the .env file with your PostgreSQL credentials

3. Run database migrations:
   ```
   npm run migrate
   ```

4. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

- `POST /save-url` - Save a new URL with notes
- `GET /saved-urls` - Get all saved URLs
- `PUT /update-url/:id` - Update a saved URL
- `POST /send-notification` - Schedule an email notification

## Database Management

To view and manage the database using DBeaver:

1. Open DBeaver
2. Create a new PostgreSQL connection
3. Enter the following details:
   - Host: localhost
   - Port: 5432
   - Database: revister
   - Username: postgres (or your custom username)
   - Password: postgres (or your custom password)
4. Test the connection and save
5. You can now browse the database tables and data 