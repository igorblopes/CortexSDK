import * as sqlite3 from 'sqlite3';
import { IFraudAssessment } from '../../interfaces';
import { FraudAssessmentModelDB, FraudAssessmentReasonModelDB } from '../../interfaces-db';

export class FraudDB {

    constructor(private db: sqlite3.Database){}

     
    async createFraudEntity(fraud: IFraudAssessment) {
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


    async findFraudByAccountHash(accountHash: string): Promise<IFraudAssessment[]> {
    
        let frauds: IFraudAssessment[] = [];
        let context = this;

        await this.db.all<FraudAssessmentModelDB>(`
            SELECT * FROM fraud WHERE account_hash = ${accountHash}
        `, function(err, rows) {

                if (err) {
                    console.error('Erro ao Buscar:', err.message);
                    return;
                }
            
            for(let item of rows){
                if(item != null){

                    context.db.all<FraudAssessmentReasonModelDB>(`
                        SELECT * FROM fraud_reason WHERE fraud_id = ${item.id}
                    `, function(err, rows) {

                        if (err) {
                            console.error('Erro ao Buscar:', err.message);
                            return;
                        }

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

    convertItemDatabaseToModel(item: FraudAssessmentModelDB, rows: FraudAssessmentReasonModelDB[]): IFraudAssessment{
    
        let dateCreatedAt = new Date(item.created_at);
        let reasons = rows.map(m => m.reason);

        let fraud: IFraudAssessment = {
            accountHash: item.account_hash,
            score: item.score,
            level: item.level,
            reasons: reasons,
            createdAt: dateCreatedAt
        };

        return fraud;
    }


}