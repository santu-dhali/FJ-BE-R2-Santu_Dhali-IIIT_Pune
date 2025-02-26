import React, { useState } from 'react';

const ExpenseDialog = ({ onClose, onAddExpense, expense }) => {
    const [category, setCategory] = useState(expense ? expense.category : '');
    const [amount, setAmount] = useState(expense ? expense.amount : '');
    const [description, setDescription] = useState(expense ? expense.description : '');
    const [date, setDate] = useState(expense ? expense.date : '');

    const expenseCategories = ['Bills', 'Car', 'Clothes', 'Food', 'House', 'Pet', 'Health', 'Transport', 'Sports'];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newExpense = { category, amount, description, date };
        if (expense) {
            // If editing, include the _id field
            newExpense._id = expense._id;
        }
        onAddExpense(newExpense);
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <h3>{expense ? 'Edit Expense' : 'New Expense'}</h3>
                <form onSubmit={handleSubmit}>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {expenseCategories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <button type="submit">{expense ? 'Update' : 'Add'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseDialog;