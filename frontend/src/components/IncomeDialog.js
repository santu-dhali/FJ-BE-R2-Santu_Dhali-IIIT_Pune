import React, { useState } from 'react';

const IncomeDialog = ({ onClose, onAddIncome, income }) => {
    const [source, setSource] = useState(income ? income.source : '');
    const [amount, setAmount] = useState(income ? income.amount : '');
    const [description, setDescription] = useState(income ? income.description : '');
    const [date, setDate] = useState(income ? income.date : '');

    const incomeSources = ['Deposit', 'Salary', 'Savings'];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newIncome = { source, amount, description, date };
        if (income) {
            // If editing, include the _id field
            newIncome._id = income._id;
        }
        onAddIncome(newIncome);
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <h3>{income ? 'Edit Income' : 'New Income'}</h3>
                <form onSubmit={handleSubmit}>
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Source</option>
                        {incomeSources.map((source) => (
                            <option key={source} value={source}>{source}</option>
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
                    <button type="submit">{income ? 'Update' : 'Add'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default IncomeDialog;