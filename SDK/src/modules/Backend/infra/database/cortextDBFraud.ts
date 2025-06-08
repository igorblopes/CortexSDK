import sqlite3 from 'sqlite3';
import { FraudAssessment } from '../../interfaces';

export class FraudDB {

    constructor(private db: sqlite3.Database){}


    async createTableFraud() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS fraud ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_hash TEXT, 
                score INTEGER, 
                created_at TEXT)
            `);     
            
            await this.createTableFraudReason();
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }
     
    async createTableFraudReason() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS fraud_reason ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reason TEXT, 
                fraud_id INTEGER,
                FOREIGN KEY (fraud_id) REFERENCES fraud(id))
            `);            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }
     
    async createFraudEntity(fraud: FraudAssessment) {
        try {
            let db = this.db;
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


}