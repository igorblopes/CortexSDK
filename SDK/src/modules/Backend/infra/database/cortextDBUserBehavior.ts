import sqlite3 from 'sqlite3';
import { UserBehavior } from '../../interfaces';

export class UserBehaviorDB {

    constructor(private db: sqlite3.Database){}

    async createTableUserBehavior() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS user_behavior ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_hash TEXT,
                session_duration integer
                created_at TEXT)
            `);     
            
            await this.createTableUserBehaviorClicks();
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async createTableUserBehaviorClicks() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS user_behavior_clicks ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                element_click TEXT,
                created_at TEXT,
                user_behavior_id INTEGER,
                FOREIGN KEY (user_behavior_id) REFERENCES user_behavior(id)))
            `);     

        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async createUserBehaviorEntity(userBehavior: UserBehavior) {
        try {
            let db = this.db;
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




    async createTableUserBehaviorScore() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS user_behavior_score ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT, 
                score INTEGER, 
                status INTEGER)
            `);            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async seedUserBehaviorScore() {
    
        try {
            await this.db.run(`
                INSERT INTO user_behavior_score (name, score, status)
                SELECT "Page change difference less than 5 seconds", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM user_behavior_score WHERE name = "Page change difference less than 5 seconds");
            `);

            await this.db.run(`
                INSERT INTO user_behavior_score (name, score, status)
                SELECT "Page change difference less than 2 seconds", 30, 1
                WHERE NOT EXISTS(SELECT 1 FROM user_behavior_score WHERE name = "Page change difference less than 2 seconds");
            `);

            await this.db.run(`
                INSERT INTO user_behavior_score (name, score, status)
                SELECT "Mean clicks less than 5 seconds", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM user_behavior_score WHERE name = "Mean clicks less than 5 seconds");
            `);

            await this.db.run(`
                INSERT INTO user_behavior_score (name, score, status)
                SELECT "Mean clicks less than 2 seconds", 20, 1
                WHERE NOT EXISTS(SELECT 1 FROM user_behavior_score WHERE name = "Mean clicks less than 5 seconds");
            `);

            
            
        } catch (err) {
            console.error('Error creating seed user_behavior_score:', err);
        }
    }

}