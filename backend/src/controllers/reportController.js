const pool = require('../config/db');  // Ensure the correct path

exports.generateMonthlyReport = async (req, res) => {
    const { year, month } = req.query;

    try {
        if (!year || !month) {
            return res.status(400).json({
                message: 'Year and month are required',
                success: false,
            });
        }

        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-31`;

        const incomeQuery = `
            SELECT source, amount, date, description 
            FROM incomes 
            WHERE user_id = $1 AND date BETWEEN $2 AND $3
        `;
        const expenseQuery = `
            SELECT category, amount, date, description 
            FROM expenses 
            WHERE user_id = $1 AND date BETWEEN $2 AND $3
        `;

        const [incomeResult, expenseResult] = await Promise.all([
            pool.query(incomeQuery, [req.userId, startDate, endDate]),
            pool.query(expenseQuery, [req.userId, startDate, endDate])
        ]);

        const incomes = incomeResult.rows;
        const expenses = expenseResult.rows;

        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const netSavings = totalIncome - totalExpenses;

        res.status(200).json({
            message: 'Monthly report generated successfully',
            success: true,
            data: {
                year: parseInt(year),
                month: parseInt(month),
                totalIncome,
                totalExpenses,
                netSavings,
                incomes,
                expenses,
            },
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            message: 'Unable to generate report',
            success: false,
            error: error.message,
        });
    }
};
    