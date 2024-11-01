const express = require('express');
const app = express();

app.use(express.json());

// In-memory storage
let students = new Map();
let currentId = 1;

// Validate student data
const validateStudent = (student) => {
    const errors = [];
    
    if (!student.name) errors.push('Name is required');
    if (!student.grade) errors.push('Grade is required');
    if (!student.email) errors.push('Email is required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (student.email && !emailRegex.test(student.email)) {
        errors.push('Invalid email format');
    }

    return errors;
};

// GET /students - Retrieve all students
app.get('/students', (req, res) => {
    const studentList = Array.from(students.values());
    res.json({
        success: true,
        count: studentList.length,
        data: studentList
    });
});

// GET /students/{id} - Retrieve a specific student
app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.get(id);

    if (!student) {
        return res.status(404).json({
            success: false,
            error: 'Student not found'
        });
    }

    res.json({
        success: true,
        data: student
    });
});

// POST /students - Create a new student
app.post('/students', (req, res) => {
    const errors = validateStudent(req.body);
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: errors
        });
    }

    // Check for duplicate email
    const emailExists = Array.from(students.values())
        .some(student => student.email === req.body.email);
    if (emailExists) {
        return res.status(400).json({
            success: false,
            error: ['Email already exists']
        });
    }

    const newStudent = {
        id: currentId++,
        name: req.body.name,
        grade: req.body.grade,
        email: req.body.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    students.set(newStudent.id, newStudent);

    res.status(201).json({
        success: true,
        data: newStudent
    });
});

// PUT /students/{id} - Update an existing student
app.put('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.get(id);

    if (!student) {
        return res.status(404).json({
            success: false,
            error: 'Student not found'
        });
    }

    const updatedStudent = {
        ...student,
        ...req.body,
        id: student.id, // Prevent ID modification
        updatedAt: new Date().toISOString()
    };

    const errors = validateStudent(updatedStudent);
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: errors
        });
    }

    // Check for duplicate email (excluding current student)
    const emailExists = Array.from(students.values())
        .some(s => s.email === updatedStudent.email && s.id !== id);
    if (emailExists) {
        return res.status(400).json({
            success: false,
            error: ['Email already exists']
        });
    }

    students.set(id, updatedStudent);

    res.json({
        success: true,
        data: updatedStudent
    });
});

// DELETE /students/{id} - Delete a student
app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (!students.has(id)) {
        return res.status(404).json({
            success: false,
            error: 'Student not found'
        });
    }

    students.delete(id);
    res.status(204).send();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
