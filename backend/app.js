const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const cors = require('cors');

PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/api/v1/auth', require('./src/routes/authRoutes'));
app.use('/api/v1/income', require('./src/routes/incomeRoutes'));
app.use('/api/v1/expense', require('./src/routes/expenseRoutes'));
app.use('/api/v1', require('./src/routes/profileRoutes'));
app.use('/api/v1', require('./src/routes/reportRoutes'));
app.use('/api/v1', require('./src/routes/budgetRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
