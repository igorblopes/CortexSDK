import sqlite3 from 'sqlite3';
import { Fingerprint, FraudAssessment, UserBehavior } from '../../interfaces';

export class database {


    path = "cortex.db";
    db = new sqlite3.Database(this.path);
    
    
    async init() {

        try {
            this.db.run(`PRAGMA foreign_keys = ON`);

            // Criacao das tabelas
            await this.createTableLoginScore(this.db);
            await this.createTableFraud(this.db);
            await this.createTableFingerprint(this.db);
            await this.createTableUserBehavior(this.db);

            // Seed das tabelas de configuracoes
            await this.seedLoginScore(this.db);
            
        } catch (err) {
            console.error('Error creating database or table:', err);
        } finally {
            this.db.close();
            console.log('Database connection closed.');
        }
    }

    

    async createTableLoginScore(db: sqlite3.Database) {
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS login_score ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT, 
                score INTEGER, 
                status INTEGER)
            `);            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async seedLoginScore(db: sqlite3.Database) {

        try {
            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new locality", 90, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new locality");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new device", 20, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new device");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new ip", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new ip");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new language", 5, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new language");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new timezone", 5, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new timezone");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its different wifi connection", -10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its different wifi connection");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new screen resolution", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new screen resolution");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new system operation", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new system operation");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new so version", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new so version");
            `);

            await db.run(`
                INSERT INTO login_score (name, score, status)
                SELECT "Its new browser agent", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM login_score WHERE name = "Its new browser agent");
            `);
            
        } catch (err) {
            console.error('Error creating seed login_score:', err);
        }
    }
    



    

    async createTableFraud(db: sqlite3.Database) {
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS fraud ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_hash TEXT, 
                score INTEGER, 
                created_at TEXT)
            `);     
            
            await this.createTableFraudReason(db);
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async createTableFraudReason(db: sqlite3.Database) {
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS fraud_reason ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reason TEXT, 
                fraud_id INTEGER,
                FOREIGN KEY (fraud_id) REFERENCES fraud(id))
            `);            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async createFraudEntity(db: sqlite3.Database, fraud: FraudAssessment) {
        try {
            await db.run(`
                INSERT INTO fraud (account_hash, score, created_at)
                VALUES (${fraud.accountHash}, ${fraud.score}, ${fraud.createdAt})
            `, 
            function(err) {

                 if (err) {
                    console.error('Erro ao inserir:', err.message);
                    return;
                }

                for(let reason of fraud.reasons){
                    db.run(`
                        INSERT INTO fraud_reason (reason, fraud_id)
                        VALUES (${reason}, ${this.lastID}) 
                    `);
                }

            });

            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }





    async createTableFingerprint(db: sqlite3.Database) {
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS fingerprint ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_hash TEXT,
                ip TEXT,
                connection_type TEXT,
                screen_resolution TEXT,
                locality TEXT,
                device TEXT,
                timezone TEXT,
                language TEXT,
                operating_system TEXT,
                so_version TEXT,
                device_type TEXT,
                created_at TEXT)
            `);     
            
            await this.createTableFraudReason(db);
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async createFingerprintEntity(db: sqlite3.Database, fingerprint: Fingerprint) {
        try {
            let locality = fingerprint.locality != null ? `${fingerprint.locality.lat} , ${fingerprint.locality.long}` : "";
            await db.run(`
                INSERT INTO fingerprint (account_hash, ip, connection_type, screen_resolution, locality, device, timezone, language, operating_system, so_version, device_type, created_at)
                VALUES (
                    ${fingerprint.accountHash}, 
                    ${fingerprint.ip},
                    ${fingerprint.connectionType},
                    ${fingerprint.screenResolution},
                    ${locality},
                    ${fingerprint.device},
                    ${fingerprint.timezone},
                    ${fingerprint.language},
                    ${fingerprint.operatingSystem},
                    ${fingerprint.soVersion},
                    ${fingerprint.deviceType},
                    ${fingerprint.createdAt}
                )
            `);

            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }





    async createTableUserBehavior(db: sqlite3.Database) {
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS user_behavior ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_hash TEXT,
                session_duration integer
                created_at TEXT)
            `);     
            
            await this.createTableUserBehaviorClicks(db);
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async createTableUserBehaviorClicks(db: sqlite3.Database) {
        try {
            await db.run(`CREATE TABLE IF NOT EXISTS user_behavior_clicks ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                element_click TEXT,
                created_at TEXT,
                user_behavior_id INTEGER,
                FOREIGN KEY (user_behavior_id) REFERENCES user_behavior(id)))
            `);     
            
            await this.createTableFraudReason(db);
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async createUserBehaviorEntity(db: sqlite3.Database, userBehavior: UserBehavior) {
        try {
            await db.run(`
                INSERT INTO user_behavior (account_hash, session_duration, created_at)
                VALUES (${userBehavior.accountHash}, ${userBehavior.sessionDuration}, ${userBehavior.createdAt})
            `, 
            function(err) {

                 if (err) {
                    console.error('Erro ao inserir:', err.message);
                    return;
                }

                for(let click of userBehavior.clicks){
                    db.run(`
                        INSERT INTO user_behavior_clicks (element_click, created_at, user_behavior_id)
                        VALUES (${click.elementClick}, ${click.createdAt} , ${this.lastID}) 
                    `);
                }

            });

            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }



}