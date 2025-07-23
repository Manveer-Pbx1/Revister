# Revister

A web application for tracking and revisiting coding problems with PostgreSQL database integration.

## Project Structure

```
revister/
├── backend/           # Node.js backend with PostgreSQL
│   ├── src/           # Modular backend code
│   └── .env           # Environment variables
├── frontend/          # React frontend
│   └── src/           # Frontend source code
└── README.md          # Project documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create the PostgreSQL database:
   ```
   npm run create-db
   ```

4. Run database migrations:
   ```
   npm run migrate
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Access the application at http://localhost:3000

## Features

- Save coding problem URLs with notes and difficulty levels
- Track completion status of problems
- Count revisits to each problem
- Schedule email notifications for revisiting problems

## Database Management

To view and manage the database using DBeaver:

1. Open DBeaver
2. Create a new PostgreSQL connection
3. Enter the following details:
   - Host: localhost
   - Port: 5432
   - Database: revister
   - Username: postgres
   - Password: [your password]
4. Test the connection and save
5. You can now browse the database tables and data 