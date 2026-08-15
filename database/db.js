const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "elwafaa.db");
const RUNTIME_DB_FILE = process.env.VERCEL
    ? "/tmp/elwafaa.db"
    : DB_FILE;

let db;

async function connectDB() {

    const SQL = await initSqlJs({
        locateFile: (file) =>
            path.join(__dirname, "../node_modules/sql.js/dist", file)
    });

    const sourceFile = fs.existsSync(RUNTIME_DB_FILE)
        ? RUNTIME_DB_FILE
        : DB_FILE;

    if (fs.existsSync(sourceFile)) {
        const file = fs.readFileSync(sourceFile);
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
            uid TEXT UNIQUE,
            role TEXT DEFAULT 'user',
            referral_code TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS wallets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            usdt REAL DEFAULT 0,
            dzc REAL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS wallet_assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            coin TEXT,
            balance REAL DEFAULT 0
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

        CREATE TABLE IF NOT EXISTS referrals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            referrer_id INTEGER,
            referred_id INTEGER,
            reward REAL DEFAULT 0,
            status TEXT DEFAULT 'PENDING',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS platform_stats (
            id INTEGER PRIMARY KEY,
            users_count INTEGER DEFAULT 22682
        );

        CREATE TABLE IF NOT EXISTS daily_rewards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            last_claim DATETIME
        );

        CREATE TABLE IF NOT EXISTS gifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            coin TEXT NOT NULL,
            amount REAL NOT NULL,
            message TEXT DEFAULT '',
            status TEXT DEFAULT 'SENT',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'INFO',
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO platform_stats (id, users_count)
        SELECT 1, 22682
        WHERE NOT EXISTS (
            SELECT 1 FROM platform_stats WHERE id=1
        );
    `);

    saveDB();

    console.log("Database connected ✅");
}


function saveDB() {

    if (!db) return;

    const data = db.export();

    fs.writeFileSync(
        RUNTIME_DB_FILE,
        Buffer.from(data)
    );
}


function getDB() {
    return db;
}


module.exports = {
    connectDB,
    getDB,
    saveDB
};
