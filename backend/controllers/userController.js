const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Input validation helper functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

const createUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Input validation
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ 
                message: 'All fields are required',
                missingFields: {
                    email: !email,
                    password: !password,
                    firstName: !firstName,
                    lastName: !lastName
                }
            });
        }

        // Email validation
        if (!validateEmail(email)) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address' 
            });
        }

        // Password validation
        if (!validatePassword(password)) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'An account with this email already exists' 
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user
        const user = await User.create({
            ...req.body,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Create user error:', error);
        if (error.code === 11000) {
            res.status(409).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Server error while creating user' });
        }
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate email if it's being updated
        if (req.body.email && !validateEmail(req.body.email)) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address' 
            });
        }

        // Validate password if it's being updated
        if (req.body.password) {
            if (!validatePassword(req.body.password)) {
                return res.status(400).json({ 
                    message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' 
                });
            }
            req.body.password = await bcrypt.hash(req.body.password, 12);
        }

        // Check for duplicate email
        if (req.body.email && req.body.email !== existingUser.email) {
            const emailExists = await User.findOne({ 
                email: req.body.email.toLowerCase(),
                _id: { $ne: id }
            });
            if (emailExists) {
                return res.status(409).json({ 
                    message: 'An account with this email already exists' 
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            id,
            { ...req.body, email: req.body.email?.toLowerCase() },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error while updating user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address' 
            });
        }

        // Find the user by email (case insensitive)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Check if the user is active
        if (!user.isActive) {
            return res.status(403).json({
                message: 'Your account has been deactivated. Please contact support for assistance.'
            });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                type: user.type
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                type: user.type,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    
};
