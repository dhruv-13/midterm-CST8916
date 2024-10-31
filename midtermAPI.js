const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-api')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [100, 'Name cannot be more than 100 characters']
    },
    grade: {
        type: String,
        required: [true, 'Grade is required'],
        trim: true,
        maxLength: [2, 'Grade cannot be more than 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format'
        }
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

// Middleware to validate student ID format
const validateStudentId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid student ID format' });
    }
    next();
};

// API Endpoints

// GET /students - Retrieve all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find()
            .select('-__v')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error retrieving students'
        });
    }
});

// GET /students/{id} - Retrieve a specific student
app.get('/students/:id', validateStudentId, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-__v');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error retrieving student'
        });
    }
});

// POST /students - Create a new student
app.post('/students', async (req, res) => {
    try {
        const { name, grade, email } = req.body;

        // Validate required fields
        if (!name || !grade || !email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name, grade, and email'
            });
        }

        const student = await Student.create(req.body);
        
        res.status(201).json({
            success: true,
            data: student
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// PUT /students/{id} - Update a student
app.put('/students/:id', validateStudentId, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-__v');

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE /students/{id} - Delete a student
app.delete('/students/:id', validateStudentId, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.status(204).json({
            success: true,
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error deleting student'
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
