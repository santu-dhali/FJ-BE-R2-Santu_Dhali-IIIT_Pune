import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaDownload } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import IncomeDialog from './IncomeDialog';
import ExpenseDialog from './ExpenseDialog';
import Card from './Card';
import "../design/Dashboard.css";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';



Chart.register(...registerables);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('income');
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showIncomeDialog, setShowIncomeDialog] = useState(false);
    const [showExpenseDialog, setShowExpenseDialog] = useState(false);
    const [editIncome, setEditIncome] = useState(null);
    const [editExpense, setEditExpense] = useState(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No authentication token found. Please log in.');
                setLoading(false);
                return;
            }
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const incomeResponse = await axios.get('https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/income/getIncome', config);
                setIncomeData(incomeResponse.data.data);

                const expenseResponse = await axios.get('https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/expense/getExpense', config);
                setExpenseData(expenseResponse.data.data);

                setLoading(false);
            } catch (err) {
                setError('Unable to fetch financial data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleAddIncome = async (newIncome) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.post('https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/income/addIncome', newIncome, config);
            setIncomeData([...incomeData, response.data.data]);
            setShowIncomeDialog(false);
        } catch (err) {
            setError('Unable to add income');
        }
    };

    const handleAddExpense = async (newExpense) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.post('https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/expense/addExpense', newExpense, config);
            setExpenseData([...expenseData, response.data.data]);
            setShowExpenseDialog(false);
        } catch (err) {
            setError('Unable to add expense');
        }
    };

    const handleEditIncome = async (updatedIncome) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.put(`https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/income/editIncome/${updatedIncome._id}`, updatedIncome, config);
            setIncomeData(incomeData.map((income) => (income._id === updatedIncome._id ? response.data.data : income)));
            setEditIncome(null);
        } catch (err) {
            setError('Unable to edit income');
        }
    };

    const handleDeleteIncome = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.delete(`https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/income/deleteIncome/${id}`, config);
            setIncomeData(incomeData.filter((income) => income._id !== id));
        } catch (err) {
            setError('Unable to delete income');
        }
    };

    const handleEditExpense = async (updatedExpense) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.put(`https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/expense/editExpense/${updatedExpense._id}`, updatedExpense, config);
            setExpenseData(expenseData.map((expense) => (expense._id === updatedExpense._id ? response.data.data : expense)));
            setEditExpense(null);
        } catch (err) {
            setError('Unable to edit expense');
        }
    };

    const handleDeleteExpense = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.delete(`https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/expense/deleteExpense/${id}`, config);
            setExpenseData(expenseData.filter((expense) => expense._id !== id));
        } catch (err) {
            setError('Unable to delete expense');
        }
    };

    const handleDownloadClick = () => {
        setShowDownloadModal(true);
    };

    const handleDownloadReport = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: { year: selectedYear, month: selectedMonth },
            };

            const response = await axios.get('https://fj-be-r2-santu-dhali-iiit-pune.onrender.com/api/v1/getReport', config);
            generatePDF(response.data.data);
            setShowDownloadModal(false);
        } catch (err) {
            console.log(err);
            setError('Unable to download report');
        }
    };

    const generatePDF = (report) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(
            `Monthly Report - ${new Date(report.year, report.month - 1).toLocaleString('default', { month: 'long' })} ${report.year}`,
            10, 10
        );
        doc.setFontSize(12);
        doc.text(`Total Income: $${report.totalIncome}`, 10, 20);
        doc.text(`Total Expenses: $${report.totalExpenses}`, 10, 30);
        doc.text(`Net Savings: $${report.netSavings}`, 10, 40);

        doc.text('Incomes:', 10, 50);
        const incomeHeaders = ['Source', 'Amount', 'Description', 'Date'];
        const incomeData = report.incomes.map((income) => [
            income.source,
            `$${income.amount}`,
            income.description,
            new Date(income.date).toLocaleDateString(),
        ]);
    
        autoTable(doc, {
            startY: 55,
            head: [incomeHeaders],
            body: incomeData,
        });

        let finalY = doc.lastAutoTable.finalY || 60;

        doc.text('Expenses:', 10, finalY + 10);
        const expenseHeaders = ['Category', 'Amount', 'Description', 'Date'];
        const expenseData = report.expenses.map((expense) => [
            expense.category,
            `$${expense.amount}`,
            expense.description,
            new Date(expense.date).toLocaleDateString(),
        ]);
    
        autoTable(doc, {
            startY: finalY + 15,
            head: [expenseHeaders],
            body: expenseData,
        });

        doc.save(`Monthly_Report_${new Date(report.year, report.month - 1).toLocaleString('default', { month: 'long' })}_${report.year}.pdf`);
    };
    

    const pieChartData = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                data: [
                    incomeData.reduce((sum, income) => sum + income.amount, 0),
                    expenseData.reduce((sum, expense) => sum + expense.amount, 0),
                ],
                backgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="dashboard">
            <div className="navbar">
                <h2>Financial Dashboard</h2>
                <div className="navbar-icons">
                    <div className="download-icon" onClick={handleDownloadClick}>
                        <FaDownload size={30} />
                    </div>
                    <div className="profile-icon" onClick={handleProfileClick}>
                        <FaUserCircle size={30} />
                    </div>
                </div>
            </div>

            {showDownloadModal && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <h3>Download Monthly Report</h3>
                        <div className="form-group">
                            <label>Year:</label>
                            <input
                                type="number"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Month:</label>
                            <input
                                type="number"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                min="1"
                                max="12"
                                required
                            />
                        </div>
                        <button onClick={handleDownloadReport}>Download</button>
                        <button onClick={() => setShowDownloadModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="main-content">
                <div className="left-section">
                    <h3>Income vs Expense</h3>
                    <Pie data={pieChartData} />
                </div>

                <div className="right-section">
                    <div className="tabs">
                        <button
                            className={activeTab === 'income' ? 'active' : ''}
                            onClick={() => setActiveTab('income')}
                        >
                            Income
                        </button>
                        <button
                            className={activeTab === 'expense' ? 'active' : ''}
                            onClick={() => setActiveTab('expense')}
                        >
                            Expense
                        </button>
                        <button className="add-button" onClick={() => setShowIncomeDialog(true)}>+</button>
                        <button className="add-button" onClick={() => setShowExpenseDialog(true)}>-</button>
                    </div>

                    <div className="data-section">
                        {activeTab === 'income' ? (
                            <div className="card-container">
                                {incomeData.map((income) => (
                                    <Card
                                        key={income._id}
                                        data={income}
                                        type="income"
                                        onEdit={setEditIncome}
                                        onDelete={handleDeleteIncome}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="card-container">
                                {expenseData.map((expense) => (
                                    <Card
                                        key={expense._id}
                                        data={expense}
                                        type="expense"
                                        onEdit={setEditExpense}
                                        onDelete={handleDeleteExpense}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="summary-section">
                <div className="summary-card">
                    <h4>Total Income</h4>
                    <p>${incomeData.reduce((sum, income) => sum + income.amount, 0)}</p>
                </div>
                <div className="summary-card">
                    <h4>Total Expense</h4>
                    <p>${expenseData.reduce((sum, expense) => sum + expense.amount, 0)}</p>
                </div>
                <div className="summary-card">
                    <h4>Total Savings</h4>
                    <p>${incomeData.reduce((sum, income) => sum + income.amount, 0) - expenseData.reduce((sum, expense) => sum + expense.amount, 0)}</p>
                </div>
            </div>

            {showIncomeDialog && (
                <IncomeDialog
                    onClose={() => setShowIncomeDialog(false)}
                    onAddIncome={handleAddIncome}
                />
            )}

            {showExpenseDialog && (
                <ExpenseDialog
                    onClose={() => setShowExpenseDialog(false)}
                    onAddExpense={handleAddExpense}
                />
            )}

            {editIncome && (
                <IncomeDialog
                    income={editIncome}
                    onClose={() => setEditIncome(null)}
                    onAddIncome={handleEditIncome}
                />
            )}

            {editExpense && (
                <ExpenseDialog
                    expense={editExpense}
                    onClose={() => setEditExpense(null)}
                    onAddExpense={handleEditExpense}
                />
            )}
        </div>
    );
};

export default Dashboard;