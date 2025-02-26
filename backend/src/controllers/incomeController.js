const Income = require('../model/Income');

const addIncome = async (req, res) => {
    const { source, amount, description, date } = req.body;
    try {
        if(!source || !amount || !description){
            return res.status(400).json({
                message: 'Please provide all required fields',
                status: false
            });
        }

        const income = await Income.create({ userId: req.userId, source, amount, description, date: date || Date.now() });
        res.status(201).json({
            message: 'Income added successfully',
            status: true,
            data: income
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to add income',
            status: false,
            error: err.message 
        });
    }
};

const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.userId });
        res.json({
            message: 'Incomes fetched successfully',
            status: true,
            data: incomes
        });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to fetch incomes',
            status: false,
            error: err.message 
        });
    }
};

const editIncome = async (req, res) => {
    const { id } = req.params;
    const { source, amount, description, date } = req.body;

    try{
        const income = await Income.findOne( {_id: id, userId: req.userId});
        if(!income){
            return res.status(404).json({
                message: 'Income not found',
                status: false
            });
        }

        if(source) income.source = source;
        if(amount) income.amount = amount;
        if(description) income.description = description;
        if(date) income.date = date;

        await income.save();

        res.json({
            message: 'Income updated successfully',
            status: true,
            data: income
        });
    }catch(err){
        res.status(400).json({
            message: 'Failed to update income',
            status: false,
            error: err.message
        });
    }
}

const deleteIncome = async (req, res) => {
    const { id } = req.params;
    try{
        const income = await Income.findOne( {_id: id, userId: req.userId});
        if(!income){
            return res.status(404).json({
                message: 'Income not found',
                status: false
            });
        }

        await income.deleteOne();
        res.status(204).json({
            message: 'Income deleted successfully',
            status: true
        })
    }catch(err){
        res.status(400).json({
            message: 'Failed to delete income',
            status: false,
            error: err.message
        });
    }
}

module.exports = { addIncome, getIncomes, editIncome, deleteIncome };