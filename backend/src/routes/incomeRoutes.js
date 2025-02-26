const express = require('express');
const router = express.Router();
const { addIncome, getIncomes, editIncome, deleteIncome } = require('../controllers/incomeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addIncome', authMiddleware, addIncome);
router.get('/getIncome', authMiddleware, getIncomes);
router.put('/editIncome/:id', authMiddleware, editIncome);
router.delete('/deleteIncome/:id', authMiddleware, deleteIncome);

module.exports = router;