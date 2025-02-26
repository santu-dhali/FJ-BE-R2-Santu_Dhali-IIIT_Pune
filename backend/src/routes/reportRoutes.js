const express = require('express');
const { generateMonthlyReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getReport', authMiddleware, generateMonthlyReport);

module.exports = router;