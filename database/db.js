const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "elwafaa.db");

let db;

async function connectDB() {

    const SQL = await initSqlJs();

    if (fs.existsSync(DB_FILE)) {
        const file = fs.readFileSync(DB_FILE);
        db = new SQL.Database(file);
    } else {
        db = new SQL.Database();
    }

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS wallets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            usdt REAL DEFAULT 0,
            dzc REAL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT,
            amount REAL,
            currency TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS deposits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            currency TEXT,
            network TEXT,
            amount REAL,
            txid TEXT,
            screenshot TEXT,
            status TEXT DEFAULT 'PENDING',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS security_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            event TEXT,
            ip TEXT,
            details TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            symbol TEXT,
            side TEXT,
            type TEXT,
            price REAL,
            amount REAL,
            status TEXT DEFAULT 'OPEN',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS trades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            buy_order_id INTEGER,
            sell_order_id INTEGER,
            symbol TEXT,
            price REAL,
            amount REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    saveDB();

    console.log("Database connected ✅");
}


function saveDB(){

    const data = db.export();

    fs.writeFileSync(
        DB_FILE,
        Buffer.from(data)
    );

}


function getDB(){
    return db;
}


module.exports = {
    connectDB,
    getDB,
    saveDB
};


