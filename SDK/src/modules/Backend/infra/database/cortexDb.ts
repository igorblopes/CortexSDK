import sqlite3 from 'sqlite3';

export class database {


    path = "cortex.db";
    
    async createDatabase() {

        const db = new sqlite3.Database(this.path);

        try {
            await db.run(`CREATE TABLE IF NOT EXISTS login_score ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR, 
                score INTEGER, 
                status INTEGER)
            `);

            await this.seedLoginScore();
            
        } catch (err) {
            console.error('Error creating database or table:', err);
        } finally {
            db.close();
            console.log('Database connection closed.');
        }
    }

    async seedLoginScore() {
        const db = new sqlite3.Database(this.path);

        try {
            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new locality", 90, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new locality");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new device", 20, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new device");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new ip", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new ip");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new language", 5, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new language");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new timezone", 5, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new timezone");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its different wifi connection", -10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its different wifi connection");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new screen resolution", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new screen resolution");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new system operation", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new system operation");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new so version", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new so version");
            `);

            await db.run(`
                INSERT INTO login_score (name VARCHAR, score INTEGER, status INTEGER)
                SELECT "Its new browser agent", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new browser agent");
            `);
            
        } catch (err) {
            console.error('Error creating database or table:', err);
        } finally {
            db.close();
            console.log('Database connection closed.');
        }
    }
}