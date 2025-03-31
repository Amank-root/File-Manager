# FilePortal: Django & Next.js File Management System

A modern web application for file management with user authentication, file uploads, and user profile management.

## Screenshot
[Image](https://postimg.cc/YjScKfcM)

## Features

### User Portal
- **Authentication**
  - Email/password authentication with JWT
  - Registration and login functionality
  - Password change
  
- **File Management**
  - File upload with automatic file type detection
  - File listing with details (filename, upload date, file type, size)
  - File download and deletion
  - Support for multiple file types (PDF, Excel, TXT, etc.)
  
- **Dashboard**
  - Display total files uploaded
  - Breakdown of file types (PDF, Excel, Word, etc.)
  - Visual representation of file statistics
  
- **User Profile**
  - Edit username and personal information
  - Add and manage multiple addresses
  - Phone number management

## Technology Stack

### Backend
- **Django**: Web framework
- **Django REST Framework**: REST API
- **Simple JWT**: JWT authentication
- **SQLite**: Database (for development)

### Frontend
- **Next.js**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **React Hook Form**: Form handling
- **Axios**: API requests

## Project Structure

```
|-- backend/               # Django backend
|   |-- core/              # Project configuration
|   |-- users/             # User authentication and profiles
|   |-- files/             # File management
|   |-- venv/              # Virtual environment
|
|-- frontend/              # Next.js frontend
    |-- src/
        |-- app/           # Next.js App Router
        |-- components/    # Reusable components
        |-- services/      # API services
        |-- store/         # Zustand stores
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- pnpm (for frontend package management)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the Next.js development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Documentation

### Authentication Endpoints
- `POST /api/users/register/`: Register new user
- `POST /api/users/login/`: Login and get JWT tokens
- `POST /api/users/token/refresh/`: Refresh token
- `POST /api/users/change-password/`: Change password

### User Profile Endpoints
- `GET /api/users/profile/`: Get user profile
- `PUT /api/users/profile/`: Update user profile
- `GET /api/users/addresses/`: Get user addresses
- `POST /api/users/addresses/`: Add new address
- `PUT /api/users/addresses/{id}/`: Update address
- `DELETE /api/users/addresses/{id}/`: Delete address

### File Management Endpoints
- `POST /api/files/upload/`: Upload file
- `GET /api/files/list/`: List user files
- `GET /api/files/download/{id}/`: Download file
- `DELETE /api/files/delete/{id}/`: Delete file
- `GET /api/files/dashboard/`: Get file statistics

## License

This project is licensed under the MIT License 