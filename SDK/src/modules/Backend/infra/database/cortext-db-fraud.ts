import sqlite3 from 'sqlite3';
import { FraudAssessment } from '../../interfaces';
import { FraudAssessmentModelDB, FraudAssessmentReasonModelDB } from '../../interfaces-db';

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


    async findFraudByAccountHash(accountHash: string): Promise<FraudAssessment[]> {
    
        let frauds: FraudAssessment[] = [];
        let context = this;

        await this.db.all<FraudAssessmentModelDB>(`
            SELECT * FROM fraud WHERE account_hash = ${accountHash}
        `, function(err, rows) {
            
            for(let item of rows){
                if(item != null){

                    context.db.all<FraudAssessmentReasonModelDB>(`
                        SELECT * FROM fraud_reason WHERE fraud_id = ${item.id}
                    `, function(err, rows) {

                        frauds.push(
                            context.convertItemDatabaseToModel(item, rows)
                        );
                        
                    })

                }
            }

        });

        frauds.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        return frauds;
    }

    convertItemDatabaseToModel(item: FraudAssessmentModelDB, rows: FraudAssessmentReasonModelDB[]): FraudAssessment{
    
        let dateCreatedAt = new Date(item.created_at);
        let reasons = rows.map(m => m.reason);

        let fraud: FraudAssessment = {
            accountHash: item.account_hash,
            score: item.score,
            level: item.level,
            reasons: reasons,
            createdAt: dateCreatedAt
        };

        return fraud;
    }


}