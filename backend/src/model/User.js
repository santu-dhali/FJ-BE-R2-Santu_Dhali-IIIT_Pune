// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: { 
//         type: String, 
//         required: true, 
//         unique: true 
//     },
//     email: { 
//         type: String, 
//         required: true, 
//         unique: true 
//     },
//     password: { 
//         type: String, 
//         required: true 
//     },
// });

// module.exports = mongoose.model('User', userSchema);

const { pool } = require('../config/db');

const createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
        INSERT INTO "User" ("username", "email", "password")
        VALUES ($1, $2, $3)
        RETURNING "userId", "username", "email";
    `;

    try {
        const result = await pool.query(query, [username, email, hashedPassword]);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
};

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM "User" WHERE "email" = $1;`;

    try {
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching user:', err);
        throw err;
    }
};

module.exports = { createUser, getUserByEmail };
