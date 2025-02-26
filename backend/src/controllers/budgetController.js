const Budget = require('../model/Budget');

exports.setBudget = async (req, res) => {
    const { category, limit, period } = req.body;
    const userId = req.userId;

    try {
        if (!category || !limit) {
            return res.status(400).json({
                message: 'Category and limit are required',
                success: false,
            });
        }

        let budget = await Budget.findOne({ userId, category });

        if (budget) {
            return res.status(400).json({
                message: 'A budget already exists for this category. Please update or delete it.',
                success: false,
            });
        }
        budget = await Budget.create({ userId, category, limit, period });

        res.status(200).json({
            message: 'Budget set successfully',
            success: true,
            data: budget,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to set budget',
            success: false,
            error: error.message,
        });
    }
};

exports.getBudgets = async (req, res) => {
    const userId = req.userId;

    try {
        const budgets = await Budget.find({ userId });
        res.status(200).json({
            message: 'Budgets fetched successfully',
            success: true,
            data: budgets,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to fetch budgets',
            success: false,
            error: error.message,
        });
    }
};

exports.updateBudget = async (req, res) => {
    const { id } = req.params;
    const { limit, period } = req.body;
    const userId = req.userId;

    try {
        const budget = await Budget.findOne({ _id: id, userId });
        if (!budget) {
            return res.status(404).json({
                message: 'Budget not found',
                success: false,
            });
        }

        if (limit) budget.limit = limit;
        if (period) budget.period = period;

        await budget.save();

        res.status(200).json({
            message: 'Budget updated successfully',
            success: true,
            data: budget,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to update budget',
            success: false,
            error: error.message,
        });
    }
};

exports.deleteBudget = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const budget = await Budget.findOne({ _id: id, userId });
        if (!budget) {
            return res.status(404).json({
                message: 'Budget not found',
                success: false,
            });
        }
        await budget.deleteOne();

        res.status(200).json({
            message: 'Budget deleted successfully',
            success: true,
            data: budget,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to delete budget',
            success: false,
            error: error.message,
        });
    }
};