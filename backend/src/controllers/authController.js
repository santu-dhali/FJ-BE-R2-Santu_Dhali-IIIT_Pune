const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

exports.signUp = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required',
            success: false
        });
    }

    try {
        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM "User" WHERE "email" = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: 'User already exists. Please Sign in with the email',
                success: false
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password does not match, try again',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert new user into PostgreSQL
        const newUser = await pool.query(
            `INSERT INTO "User" ("username", "email", "password") 
             VALUES ($1, $2, $3) RETURNING "userId", "username", "email"`,
            [username, email, hashedPassword]
        );

        return res.status(200).json({
            message: 'User created successfully',
            success: true,
            data: newUser.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to create user, please try again',
            success: false,
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'All fields are required',
            success: false
        });
    }

    try {
        // Check if user exists in PostgreSQL
        const result = await pool.query('SELECT * FROM "User" WHERE "email" = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Invalid credentials, please try again',
                success: false
            });
        }

        const existingUser = result.rows[0];

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Passwords do not match, please try again',
                success: false
            });
        }

        // Create JWT token
        const payload = {
            email: existingUser.email,
            id: existingUser.userId
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Remove password before sending response
        delete existingUser.password;
        existingUser.token = token;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.cookie('token', token, options).json({
            message: 'User logged in successfully',
            success: true,
            existingUser
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to login, please try again',
            success: false,
            error: error.message
        });
    }
};

