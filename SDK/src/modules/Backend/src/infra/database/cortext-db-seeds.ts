import * as sqlite3 from 'sqlite3';

export class SeedDB {

    constructor(private db: sqlite3.Database){}


    async createTablesAndSeed(): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
                this.db.exec(
                `
                    BEGIN;
                    
                    DROP TABLE IF EXISTS fingerprint_score;

                    CREATE TABLE IF NOT EXISTS fingerprint_score (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        score INTEGER,
                        status INTEGER
                    );

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new locality', 90, 1);

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new device', 20, 1);
                    
                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new ip', 10, 1);

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new language', 5, 1);

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new timezone', 5, 1);

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its different wifi connection', 10, 1);

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new screen resolution', 10, 1);

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new system operation', 10, 1);

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new so version', 10, 1);

                    INSERT INTO fingerprint_score (name, score, status)
                    VALUES ('Its new browser agent', 10, 1);
                    
                    CREATE TABLE IF NOT EXISTS fraud ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        account_hash TEXT, 
                        score INTEGER, 
                        created_at TEXT
                    );

                    CREATE TABLE IF NOT EXISTS fraud_reason ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        reason TEXT, 
                        fraud_id INTEGER,
                        FOREIGN KEY (fraud_id) REFERENCES fraud(id)
                    );

                    DROP TABLE IF EXISTS sense_score;

                    CREATE TABLE IF NOT EXISTS sense_score ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        min_score INTEGER, 
                        max_score INTEGER, 
                        level TEXT
                    );

                    INSERT INTO sense_score (min_score, max_score, level)
                    VALUES (0, 39, 'allow');

                    INSERT INTO sense_score (min_score, max_score, level)
                    VALUES (40, 79, 'review');

                    INSERT INTO sense_score (min_score, max_score, level)
                    VALUES (80, 100, 'deny');

                    CREATE TABLE IF NOT EXISTS fingerprint ( 
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
                        browser_agent TEXT,
                        created_at TEXT
                    );

                    CREATE TABLE IF NOT EXISTS user_behavior ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        page_visit TEXT,
                        account_hash TEXT,
                        session_duration integer,
                        created_at TEXT
                    );

                    CREATE TABLE IF NOT EXISTS user_behavior_clicks ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        element_click TEXT,
                        created_at TEXT,
                        user_behavior_id INTEGER,
                        FOREIGN KEY (user_behavior_id) REFERENCES user_behavior(id)
                    );

                    CREATE TABLE IF NOT EXISTS checkout ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        account_hash TEXT,
                        created_at TEXT
                    );

                    CREATE TABLE IF NOT EXISTS checkout_itens ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        type TEXT, 
                        quantity INTEGER, 
                        unityvalue INTEGER,
                        checkout_id INTEGER,
                        created_at TEXT,
                        FOREIGN KEY (checkout_id) REFERENCES checkout(id)
                    );

                    DROP TABLE IF EXISTS user_behavior_score;

                    CREATE TABLE IF NOT EXISTS user_behavior_score ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT, 
                        score INTEGER, 
                        status INTEGER
                    );

                    INSERT INTO user_behavior_score (name, score, status)
                    VALUES ('Page change difference less than 5 seconds', 10, 1);

                    INSERT INTO user_behavior_score (name, score, status)
                    VALUES ('Page change difference less than 2 seconds', 30, 1);

                    INSERT INTO user_behavior_score (name, score, status)
                    VALUES ('Mean clicks less than 5 seconds', 10, 1);

                    INSERT INTO user_behavior_score (name, score, status)
                    VALUES ('Mean clicks less than 2 seconds', 20, 1);

                    DROP TABLE IF EXISTS checkout_score;

                    CREATE TABLE IF NOT EXISTS checkout_score ( 
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT, 
                        score INTEGER, 
                        status INTEGER
                    );

                    INSERT INTO checkout_score (name, score, status)
                    VALUES ('Itens types never purchased before', 10, 1);

                    INSERT INTO checkout_score (name, score, status)
                    VALUES ('Quantity itens never purchased before', 10, 1);

                    INSERT INTO checkout_score (name, score, status)
                    VALUES ('Total value 30% of purchase above mean', 10, 1);

                    INSERT INTO checkout_score (name, score, status)
                    VALUES ('Total value 50% of purchase above mean', 10, 1);

                    INSERT INTO checkout_score (name, score, status)
                    VALUES ('Total value 100% of purchase above mean', 10, 1);

                    INSERT INTO checkout_score (name, score, status)
                    VALUES ('First Buy Bigger Than 2000', 90, 1);
                    
                    COMMIT;
                `,
                (err) => (err ? reject(err) : resolve("sucesso1"))
            );              
        });
         
    }

    
    


}