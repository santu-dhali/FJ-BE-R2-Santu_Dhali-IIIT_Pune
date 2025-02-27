// const { pool } = require('./db');

// const createTables = async () => {
//     const userTable = `
//         CREATE TABLE IF NOT EXISTS "User" (
//             "userId" SERIAL PRIMARY KEY,
//             "username" VARCHAR(255) UNIQUE NOT NULL,
//             "email" VARCHAR(255) UNIQUE NOT NULL,
//             "password" VARCHAR(255) NOT NULL,
//             "createdAt" TIMESTAMP DEFAULT NOW()
//         );
//     `;

//     const incomeTable = `
//         CREATE TABLE IF NOT EXISTS "Income" (
//             "incomeId" SERIAL PRIMARY KEY,
//             "userId" INT NOT NULL,
//             "source" VARCHAR(255) NOT NULL,
//             "amount" NUMERIC(10,2) NOT NULL,
//             "date" TIMESTAMP DEFAULT NOW(),
//             "description" TEXT,
//             FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE
//         );
//     `;

//     const expenseTable = `
//         CREATE TABLE IF NOT EXISTS "Expense" (
//             "expenseId" SERIAL PRIMARY KEY,
//             "userId" INT NOT NULL,
//             "category" VARCHAR(255) NOT NULL,
//             "amount" NUMERIC(10,2) NOT NULL,
//             "date" TIMESTAMP DEFAULT NOW(),
//             "description" TEXT,
//             FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE
//         );
//     `;

//     const budgetTable = `
//         CREATE TABLE IF NOT EXISTS "Budget" (
//             "budgetId" SERIAL PRIMARY KEY,
//             "userId" INT NOT NULL,
//             "category" VARCHAR(255) NOT NULL,
//             "limit" NUMERIC(10,2) NOT NULL,
//             "period" VARCHAR(20) CHECK ("period" IN ('monthly', 'weekly', 'yearly')) DEFAULT 'monthly',
//             "createdAt" TIMESTAMP DEFAULT NOW(),
//             UNIQUE ("userId", "category"),
//             FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE
//         );
//     `;

//     try {
//         await pool.query(userTable);
//         await pool.query(incomeTable);
//         await pool.query(expenseTable);
//         await pool.query(budgetTable);
//         console.log('Tables created successfully');
//     } catch (err) {
//         console.error('Error creating tables:', err);
//     } finally {
//         pool.end();
//     }
// };

// createTables();
