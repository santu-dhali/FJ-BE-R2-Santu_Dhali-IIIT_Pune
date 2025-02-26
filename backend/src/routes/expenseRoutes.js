const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, editExpense, deleteExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addExpense', authMiddleware, addExpense);
router.get('/getExpense', authMiddleware, getExpenses);
router.put('/editExpense/:id', authMiddleware, editExpense);
router.delete('/deleteExpense/:id', authMiddleware, deleteExpense);

module.exports = router;