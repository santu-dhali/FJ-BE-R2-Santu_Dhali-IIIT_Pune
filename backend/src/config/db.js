// const mongoose = require('mongoose');
// require('dotenv').config();

// const connectDB = async () => {
//     try{
//         await mongoose.connect(process.env.MONGO_URI, {});
//         console.log('MongoDB connected successfully');
//     }catch(err){
//         console.error('MongoDB connection failed');
//         console.error(err);
//         process.exit(1);
//     }
// }

// module.exports = connectDB;

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.pgUser,
    host: process.env.pgHost,
    database: process.env.pgDatabase,
    password: String(process.env.pgPassword),
    port: process.env.pgPort,
});

const connectDB = async () => {
    try{
        await pool.connect();
        console.log('Postgres connected successfully');
    }catch(err){
        console.error('Postgres connection failed');
        console.error(err);
        process.exit(1);
    }
}

module.exports = {connectDB, pool}