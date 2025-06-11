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

        console.log('Creating user with data:', { ...req.body, password: '[HIDDEN]' });

        // Input validation
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ 
                message: 'Required fields missing: email, password, firstName, lastName',
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

        // Password validation - only for new users or when password is provided
        if (password && !validatePassword(password)) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' 
            });
        }

        // Check if user already exists by email
        const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingUserByEmail) {
            return res.status(409).json({ 
                message: 'An account with this email already exists' 
            });
        }

        // Generate username if not provided
        let username = req.body.username || email.split('@')[0];
        
        // Check if username already exists and make it unique if needed
        let usernameExists = await User.findOne({ username });
        let counter = 1;
        while (usernameExists) {
            username = `${req.body.username || email.split('@')[0]}${counter}`;
            usernameExists = await User.findOne({ username });
            counter++;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user with all provided fields
        const userData = {
            firstName,
            lastName,
            email: email.toLowerCase(),
            username,
            password: hashedPassword,
            type: req.body.type || 'editor',
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
            // Optional fields - only include if provided
            ...(req.body.age && { age: req.body.age }),
            ...(req.body.gender && { gender: req.body.gender }),
            ...(req.body.contactNumber && { contactNumber: req.body.contactNumber }),
            ...(req.body.address && { address: req.body.address }),
        };

        console.log('Creating user with final data:', { ...userData, password: '[HIDDEN]' });

        const user = await User.create(userData);

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        console.log('User created successfully:', userResponse);

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Create user error:', error);
        
        if (error.code === 11000) {
            // Handle duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            res.status(409).json({ 
                message: `${field === 'email' ? 'Email' : 'Username'} already exists` 
            });
        } else if (error.name === 'ValidationError') {
            // Handle mongoose validation errors
            const validationErrors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ 
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            res.status(500).json({ message: 'Server error while creating user' });
        }
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Updating user:', id, 'with data:', { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined });

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

        // Check for duplicate username
        if (req.body.username && req.body.username !== existingUser.username) {
            const usernameExists = await User.findOne({ 
                username: req.body.username,
                _id: { $ne: id }
            });
            if (usernameExists) {
                return res.status(409).json({ 
                    message: 'Username already exists' 
                });
            }
        }

        // Prepare update data
        const updateData = { ...req.body };
        if (updateData.email) {
            updateData.email = updateData.email.toLowerCase();
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        console.log('User updated successfully:', user);

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(409).json({ 
                message: `${field === 'email' ? 'Email' : 'Username'} already exists` 
            });
        } else if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ 
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            res.status(500).json({ message: 'Server error while updating user' });
        }
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User deleted successfully:', id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt for email:', email);

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
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', user.email);

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