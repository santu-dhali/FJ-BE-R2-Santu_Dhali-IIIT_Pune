const { pool } = require('../config/db'); // Import PostgreSQL pool

// Add Expense
const addExpense = async (req, res) => {
    const { category, amount, description, date } = req.body;

    try {
        if (!category || !amount || !description) {
            return res.status(400).json({
                message: 'Please provide all required fields',
                status: false
            });
        }

        const result = await pool.query(
            `INSERT INTO "Expense" ("userId", "category", "amount", "description", "date") 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.userId, category, amount, description, date || new Date()]
        );

        res.status(201).json({
            message: 'Expense added successfully',
            status: true,
            data: result.rows[0]
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to add expense',
            status: false,
            error: err.message
        });
    }
};

// Get All Expenses
const getExpenses = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM "Expense" WHERE "userId" = $1 ORDER BY "date" DESC`,
            [req.userId]
        );

        res.json({
            message: 'Expenses fetched successfully',
            status: true,
            data: result.rows
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to fetch expenses',
            status: false,
            error: err.message
        });
    }
};

// Edit Expense
const editExpense = async (req, res) => {
    const { id } = req.params;
    const { category, amount, description, date } = req.body;

    id = parseInt(id, 10);
    if (isNaN(id)) {
        return res.status(400).json({
            message: 'Invalid expense ID',
            status: false
        });
    }

    try {
        const existingExpense = await pool.query(
            `SELECT * FROM "Expense" WHERE "expenseId" = $1 AND "userId" = $2`,
            [id, req.userId]
        );

        if (existingExpense.rows.length === 0) {
            return res.status(404).json({
                message: 'Expense not found',
                status: false
            });
        }

        const updatedExpense = await pool.query(
            `UPDATE "Expense" 
             SET "category" = COALESCE($1, "category"),
                 "amount" = COALESCE($2, "amount"),
                 "description" = COALESCE($3, "description"),
                 "date" = COALESCE($4, "date")
             WHERE "expenseId" = $5 AND "userId" = $6 
             RETURNING *`,
            [category || null, amount || null, description || null, date || null, id, req.userId]
        );

        res.json({
            message: 'Expense updated successfully',
            status: true,
            data: updatedExpense.rows[0]
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to update expense',
            status: false,
            error: err.message
        });
    }
};

// Delete Expense
const deleteExpense = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const existingExpense = await pool.query(
            `SELECT * FROM "Expense" WHERE "expenseId" = $1 AND "userId" = $2`,
            [id, req.userId]
        );

        if (existingExpense.rows.length === 0) {
            return res.status(404).json({
                message: 'Expense not found',
                status: false
            });
        }

        await pool.query(`DELETE FROM "Expense" WHERE "expenseId" = $1 AND "userId" = $2`, [id, req.userId]);

        res.status(200).json({
            message: 'Expense deleted successfully',
            status: true
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to delete expense',
            status: false,
            error: err.message
        });
    }
};

module.exports = { addExpense, getExpenses, editExpense, deleteExpense };
