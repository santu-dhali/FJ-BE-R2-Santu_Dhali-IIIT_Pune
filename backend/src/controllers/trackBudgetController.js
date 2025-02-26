const Budget = require('../model/Budget');
const Expense = require('../model/Expense');
const User = require('../model/User');

exports.trackBudgetProgress = async (req, res) => {
    const { category } = req.body;
    const userId = req.userId;

    try {
        const budget = await Budget.findOne({ userId, category });
        if (!budget) {
            return res.status(404).json({
                message: 'Budget not found for the specified category',
                success: false,
            });
        }

        const now = new Date();
        let startDate, endDate;

        if (budget.period === 'monthly') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (budget.period === 'weekly') {
            startDate = new Date(now.setDate(now.getDate() - now.getDay()));
            endDate = new Date(now.setDate(now.getDate() + 6));
        } else if (budget.period === 'yearly') {
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        }

        const expenses = await Expense.find({
            userId,
            category,
            date: { $gte: startDate, $lte: endDate },
        });

        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const progress = (totalExpenses / budget.limit) * 100;
        const isOverBudget = totalExpenses > budget.limit;

        // if (isOverBudget) {
        //     const user = await User.find(userId);
        //     if (user && user.email) {
        //         const subject = 'Budget Overrun Alert';
        //         const text = `You have exceeded your budget for ${category}.`;
        //         const html = `<p>You have exceeded your budget for <strong>${category}</strong>.</p>
        //                       <p>Total Expenses: ${totalExpenses}</p>
        //                       <p>Budget Limit: ${budget.limit}</p>`;

        //         await sendEmail(user.email, subject, text, html);
        //     }
        // }

        res.status(200).json({
            message: 'Budget progress fetched successfully',
            success: true,
            data: {
                category: budget.category,
                limit: budget.limit,
                totalExpenses,
                progress: progress.toFixed(2),
                isOverBudget,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to track budget progress',
            success: false,
            error: error.message,
        });
    }
};