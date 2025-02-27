const { pool } = require('../config/db'); // Import PostgreSQL connection
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT "userId", "username", "email", "createdAt" FROM "User" WHERE "userId" = $1`, 
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        res.status(200).json({
            message: 'Profile fetched successfully',
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to fetch profile',
            success: false,
            error: error.message,
        });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    const { username, email, currentPassword, newPassword } = req.body;

    try {
        const userResult = await pool.query(
            `SELECT "userId", "username", "email", "password" FROM "User" WHERE "userId" = $1`, 
            [req.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        let user = userResult.rows[0];
        let updatedUsername = username || user.username;
        let updatedEmail = email || user.email;
        let updatedPassword = user.password; // Default to existing password

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Current password is incorrect',
                    success: false,
                });
            }
            updatedPassword = await bcrypt.hash(newPassword, 12);
        }

        const updateResult = await pool.query(
            `UPDATE "User" 
             SET "username" = $1, "email" = $2, "password" = $3 
             WHERE "userId" = $4 
             RETURNING "userId", "username", "email", "createdAt"`,
            [updatedUsername, updatedEmail, updatedPassword, req.userId]
        );

        res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            data: updateResult.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to update profile',
            success: false,
            error: error.message,
        });
    }
};
