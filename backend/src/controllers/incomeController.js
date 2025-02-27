const { pool } = require('../config/db'); // Import PostgreSQL pool

// Add Income
const addIncome = async (req, res) => {
    const { source, amount, description, date } = req.body;

    try {
        if (!source || !amount || !description) {
            return res.status(400).json({
                message: 'Please provide all required fields',
                status: false
            });
        }

        const result = await pool.query(
            `INSERT INTO "Income" ("userId", "source", "amount", "description", "date") 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.userId, source, amount, description, date || new Date()]
        );

        res.status(201).json({
            message: 'Income added successfully',
            status: true,
            data: result.rows[0]
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to add income',
            status: false,
            error: err.message
        });
    }
};

// Get All Incomes
const getIncomes = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM "Income" WHERE "userId" = $1 ORDER BY "date" DESC`,
            [req.userId]
        );

        res.json({
            message: 'Incomes fetched successfully',
            status: true,
            data: result.rows
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to fetch incomes',
            status: false,
            error: err.message
        });
    }
};

// Edit Income
const editIncome = async (req, res) => {
    const { id } = req.params;
    const { source, amount, description, date } = req.body;

    try {
        const existingIncome = await pool.query(
            `SELECT * FROM "Income" WHERE "incomeId" = $1 AND "userId" = $2`,
            [id, req.userId]
        );

        if (existingIncome.rows.length === 0) {
            return res.status(404).json({
                message: 'Income not found',
                status: false
            });
        }

        const updatedIncome = await pool.query(
            `UPDATE "Income" 
             SET "source" = COALESCE($1, "source"),
                 "amount" = COALESCE($2, "amount"),
                 "description" = COALESCE($3, "description"),
                 "date" = COALESCE($4, "date")
             WHERE "incomeId" = $5 AND "userId" = $6 
             RETURNING *`,
            [source || null, amount || null, description || null, date || null, id, req.userId]
        );

        res.json({
            message: 'Income updated successfully',
            status: true,
            data: updatedIncome.rows[0]
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to update income',
            status: false,
            error: err.message
        });
    }
};

// Delete Income
const deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const existingIncome = await pool.query(
            `SELECT * FROM "Income" WHERE "incomeId" = $1 AND "userId" = $2`,
            [id, req.userId]
        );

        if (existingIncome.rows.length === 0) {
            return res.status(404).json({
                message: 'Income not found',
                status: false
            });
        }

        await pool.query(`DELETE FROM "Income" WHERE "incomeId" = $1 AND "userId" = $2`, [id, req.userId]);

        res.status(200).json({
            message: 'Income deleted successfully',
            status: true
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to delete income',
            status: false,
            error: err.message
        });
    }
};

module.exports = { addIncome, getIncomes, editIncome, deleteIncome };
