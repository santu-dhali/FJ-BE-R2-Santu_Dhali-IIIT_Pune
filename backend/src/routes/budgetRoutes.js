const express = require('express');
const {setBudget, getBudgets, updateBudget, deleteBudget} = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const { trackBudgetProgress } = require('../controllers/trackBudgetController');

const router = express.Router();

router.post('/setBudget', authMiddleware, setBudget);
router.get('/getBudget', authMiddleware, getBudgets);
router.put('/editBudget/:id', authMiddleware, updateBudget);
router.delete('/deleteBudget/:id', authMiddleware, deleteBudget);
router.get('/getBudget/:id', authMiddleware, trackBudgetProgress);

module.exports = router;