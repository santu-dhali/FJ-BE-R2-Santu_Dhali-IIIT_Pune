const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getProfile', authMiddleware, getProfile);
router.put('/updateProfile', authMiddleware, updateProfile);

module.exports = router;