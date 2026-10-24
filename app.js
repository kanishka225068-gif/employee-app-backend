// Task1: initiate app and run server at 3000

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// parse JSON request bodies
app.use(express.json());

// run server at 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 

// Replace <username>, <password>, <cluster-url> with your Atlas details
const MONGO_URI = 'mongodb+srv://employeeuse1:Emp-12345@cluster0.8sqxjyd.mongodb.net/';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.log('MongoDB connection error:', err.message));

const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});
const Employee = mongoose.model('Employee', employeeSchema, 'employeelist');

// the folder inside dist is named "Frontend", so serve that path too
app.use(express.static(path.join(__dirname, 'dist/Frontend')));


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below



//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employees', error: err.message });
    }
});


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee', error: err.message });
    }
});


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const employee = new Employee({
            name: req.body.name,
            location: req.body.location,
            position: req.body.position,
            salary: req.body.salary
        });
        const saved = await employee.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: 'Error adding employee', error: err.message });
    }
});


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted', employee: deleted });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting employee', error: err.message });
    }
});


//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async (req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(
            req.body._id,
            {
                name: req.body.name,
                location: req.body.location,
                position: req.body.position,
                salary: req.body.salary
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating employee', error: err.message });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});