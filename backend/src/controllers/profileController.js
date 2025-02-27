const User = require('../model/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne(req.UserId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }
        res.status(200).json({
            message: 'Profile fetched successfully',
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to fetch profile',
            success: false,
            error: error.message,
        });
    }
};

exports.updateProfile = async (req, res) => {
    const { username, email, currentPassword, newPassword } = req.body;
    try {
        const user = await User.findOne(req.UserId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Current password is incorrect',
                    success: false,
                });
            }
            user.password = await bcrypt.hash(newPassword, 12);
        }

        await user.save();
        res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to update profile',
            success: false,
            error: error.message,
        });
    }
};

