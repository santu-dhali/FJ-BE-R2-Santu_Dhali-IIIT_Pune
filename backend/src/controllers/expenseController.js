const Expense = require('../model/Expense');

const addExpense = async (req, res) => {
    const { category, amount, description, date } = req.body;
    try {
        if(!category || !amount || !description){
            return res.status(400).json({
                message: 'Please provide all required fields',
                status: false
            });
        }

        const expense = await Expense.create({ userId: req.userId, category, amount, description, date: date || Date.now() });
        res.status(201).json({
            message: 'Expense added successfully',
            status: true,
            data: expense
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to add expense',
            status: false,
            error: err.message 
        });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId });
        res.json({
            message: 'Expenses fetched successfully',
            status: true,
            data: expenses
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to fetch expense',
            status: false,
            error: err.message 
        });
    }
};

const editExpense = async (req, res) => {
    const { id } = req.params;
    const { category, amount, description, date } = req.body;

    try{
        const expense = await Expense.findOne( {_id: id, userId: req.userId});
        if(!expense){
            return res.status(404).json({
                message: 'expense not found',
                status: false
            });
        }

        if(category) expense.category = category;
        if(amount) expense.amount = amount;
        if(description) expense.description = description;
        if(date) expense.date = date;

        await expense.save();

        res.json({
            message: 'Expense updated successfully',
            status: true,
            data: expense
        });
    }catch(err){
        res.status(400).json({
            message: 'Failed to update expense',
            status: false,
            error: err.message
        });
    }
}

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try{
        const expense = await Expense.findOne( {_id: id, userId: req.userId});
        if(!expense){
            return res.status(404).json({
                message: 'Expense not found',
                status: false
            });
        }

        await expense.deleteOne();
        res.status(204).json({
            message: 'Expense deleted successfully',
            status: true
        })
    }catch(err){
        res.status(400).json({
            message: 'Failed to delete expense',
            status: false,
            error: err.message
        });
    }
}

module.exports = { addExpense, getExpenses, editExpense, deleteExpense };