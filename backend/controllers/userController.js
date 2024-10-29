const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {sendEmail,sendCourseDetail} = require('../utils/mailer');

// Register a new user
exports.createUser = async (req, res) => {
    const { username, email, password ,phno,dob,gender,location,role,profession} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ username, email, password: hashedPassword,phno,dob,gender,location,role,profession});
    
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Log in user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('token', token, { httpOnly: true }).send({ id: user._id,name:user.username,email:user.email, role: user.role });
};

// Get all users
exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// Get user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
};

// Update user by ID
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    await User.findByIdAndDelete(id);
    
    res.status(204).send();
};

// Get users by instructor status
exports.getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ isInstructor: true });
        
        // Send the instructors as a JSON response
        res.status(200).json({ instructors });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add instructor
exports.addInstructor = async (req, res) => {
    const { password, ...instructorData } = req.body; // Destructure to get password separately

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        const newInstructor = new User({ ...instructorData, password: hashedPassword, isInstructor: true });
        
        const savedInstructor = await newInstructor.save();

        // Send the original password via email
        const emailText = `Hello ${instructorData.username},\n\nMessage from Admin\n\n\n\nHere are your login credentials:\nEmail: ${instructorData.email}\nPassword: ${password}\n\n\n\nBest Regards,\nYour Team`;
        await sendEmail(instructorData.email, emailText);

        res.status(201).json(savedInstructor);
    } catch (error) {
        res.status(400).json({ error: error.message }); // Send a more descriptive error message
    }
};

exports.sendEmail = async (req, res) => {
    const {from_name, to_email, course_name, course_description, y_link, p_link } = req.body;
    try{
    await sendCourseDetail(from_name,to_email, course_name, course_description, y_link, p_link);

    res.status(200).json({ message: 'Email sent successfully' });
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};