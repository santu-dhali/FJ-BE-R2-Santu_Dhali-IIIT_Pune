const Income = require('../model/Income');
const Expense = require('../model/Expense');

exports.generateMonthlyReport = async (req, res) => {
    const { year, month } = req.query;

    try {
        if (!year || !month) {
            return res.status(400).json({
                message: 'Year and month are required',
                success: false,
            });
        }
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const incomes = await Income.find({
            userId: req.userId,
            date: { $gte: startDate, $lte: endDate },
        });

        const expenses = await Expense.find({
            userId: req.userId,
            date: { $gte: startDate, $lte: endDate },
        });

        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        const netSavings = totalIncome - totalExpenses;

        const report = {
            year: parseInt(year),
            month: parseInt(month),
            totalIncome,
            totalExpenses,
            netSavings,
            incomes: incomes.map(income => ({
                source: income.source,
                amount: income.amount,
                date: income.date,
                description: income.description,
            })),
            expenses: expenses.map(expense => ({
                category: expense.category,
                amount: expense.amount,
                date: expense.date,
                description: expense.description,
            })),
        };

        res.status(200).json({
            message: 'Monthly report generated successfully',
            success: true,
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to generate report',
            success: false,
            error: error.message,
        });
    }
};