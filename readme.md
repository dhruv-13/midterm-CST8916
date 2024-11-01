# Student API

A simple RESTful API for managing student records. This API provides endpoints for creating, reading, updating, and deleting student information.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Running Locally](#running-locally)
- [Testing the API](#testing-the-api)
- [Error Handling](#error-handling)

## Features
- CRUD operations for student management
- Input validation
- Email uniqueness validation
- In-memory data storage
- RESTful architecture
- Consistent response format

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Project Setup

1. Clone the repository
```bash
git clone https://github.com/dhruv-13/midterm-CST8916.git
cd midterm-CST8916
```

2. Install dependencies
```bash
npm install
```

3. Create project structure
```
student-api/
├── node_modules/
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Environment Configuration

1. Create `.env` file in the project root
```bash
touch .env
```

2. Add the following configuration to `.env`:
```env
PORT=3000
NODE_ENV=development
```

3. Create `.gitignore` file:
```
node_modules/
.env
```

## API Endpoints

### 1. Get All Students
- **URL:** `/students`
- **Method:** `GET`
- **Response:**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "id": 1,
            "name": "John Doe",
            "grade": "A",
            "email": "john@example.com",
            "createdAt": "2024-10-31T10:00:00.000Z",
            "updatedAt": "2024-10-31T10:00:00.000Z"
        }
    ]
}
```

### 2. Get Student by ID
- **URL:** `/students/{id}`
- **Method:** `GET`
- **Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "grade": "A",
        "email": "john@example.com",
        "createdAt": "2024-10-31T10:00:00.000Z",
        "updatedAt": "2024-10-31T10:00:00.000Z"
    }
}
```

### 3. Create Student
- **URL:** `/students`
- **Method:** `POST`
- **Body:**
```json
{
    "name": "John Doe",
    "grade": "A",
    "email": "john@example.com"
}
```
- **Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "grade": "A",
        "email": "john@example.com",
        "createdAt": "2024-10-31T10:00:00.000Z",
        "updatedAt": "2024-10-31T10:00:00.000Z"
    }
}
```

### 4. Update Student
- **URL:** `/students/{id}`
- **Method:** `PUT`
- **Body:**
```json
{
    "grade": "B"
}
```
- **Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "grade": "B",
        "email": "john@example.com",
        "createdAt": "2024-10-31T10:00:00.000Z",
        "updatedAt": "2024-10-31T10:00:00.000Z"
    }
}
```

### 5. Delete Student
- **URL:** `/students/{id}`
- **Method:** `DELETE`
- **Response:** `204 No Content`

## Running Locally

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

3. The API will be available at:
```
http://localhost:3000
```

## Testing the API

You can test the API using cURL:

```bash
# Get all students
curl http://localhost:3000/students

# Get specific student
curl http://localhost:3000/students/1

# Create student
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "grade": "A",
    "email": "john@example.com"
  }'

# Update student
curl -X PUT http://localhost:3000/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "grade": "B"
  }'

# Delete student
curl -X DELETE http://localhost:3000/students/1
```

## Error Handling

The API handles various error cases:

1. Invalid Input
```json
{
    "success": false,
    "error": ["Name is required", "Invalid email format"]
}
```

2. Resource Not Found
```json
{
    "success": false,
    "error": "Student not found"
}
```

3. Duplicate Email
```json
{
    "success": false,
    "error": ["Email already exists"]
}
```

## License
MIT

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
