import * as sqlite3 from 'sqlite3';
import { IFraudAssessment } from '../../interfaces';
import { FraudAssessmentModelDB, FraudAssessmentReasonModelDB } from '../../interfaces-db';

export class FraudDB {

    constructor(private db: sqlite3.Database){}


    async createFraud(fraud: IFraudAssessment) {
        return await new Promise<number>((resolve, reject) => {

            this.db.run(`
                    INSERT INTO fraud (account_hash, score, created_at)
                    VALUES ('${fraud.accountHash}', '${fraud.score}', '${fraud.createdAt}')
                `,function (err) {

                    if(err) reject(err);

                    resolve(this.lastID);
                });

        });
    }
     
    async createFraudEntity(fraud: IFraudAssessment) {
        return await new Promise<void>((resolve, reject) => {


            this.createFraud(fraud)
                .then((lastID) => {

                    for(let reason of fraud.reasons){
                        this.db.run(`
                            INSERT INTO fraud_reason (reason, fraud_id)
                            VALUES ('${reason}', '${lastID}') 
                        `);
                    }

                    setTimeout(() => {resolve()}, 500)


                })
                .catch((err) => reject(err))
           
               
        });
    }


    async findFraudByAccountHash(accountHash: string): Promise<IFraudAssessment[]> {
    
        let frauds: IFraudAssessment[] = [];
        let context = this;

        return await new Promise<IFraudAssessment[]>((resolve, reject) => {

            this.db.all(
                `
                    SELECT * FROM fraud WHERE account_hash = ${accountHash}
                `
                ,(err: any, rows: any[]) => {

                    if (err) {
                        reject(err);
                    }

                    if(!rows || rows.length == 0) {
                        resolve(frauds);
                    }

                    for(let item of rows){
                        if(item != null){

                            context.db.all(
                                `
                                    SELECT * FROM fraud_reason WHERE fraud_id = '${item.id}'
                                `
                                ,(err: any, rowsItems: any[]) => {

                                    if (err) {
                                        reject(err);
                                    }

                                    let reasons = [];

                                    for(let itemReason of rowsItems){
                                       reasons.push(itemReason.reason);
                                    }


                                    let fraud: IFraudAssessment = {
                                        accountHash: accountHash,
                                        score: item.score,
                                        level: item.level,
                                        reasons: reasons,
                                        createdAt: item.created_at
                                    }

                                    
                                    frauds.push(fraud);

                                    resolve(frauds);


                                }
                            )

                        }
                    }
                }
            );
        
        });
    }




    async findAllFrauds(): Promise<IFraudAssessment[]> {
        let frauds: IFraudAssessment[] = [];

        return await new Promise<IFraudAssessment[]>((resolve, reject) => {

            this.db.all(
                `
                    SELECT f.id,
                            f.account_hash,
                            f.score,
                            f.created_at,
                            fr.reason
                    FROM fraud f
                    LEFT JOIN fraud_reason fr
                    ON f.id = fr.fraud_id
                    ORDER BY f.id;
                `
               ,(err: any, rows: any[]) => {

                    if (err) {
                        reject(err);
                    }

                    if(!rows || rows.length == 0) {
                        resolve(frauds);
                    }

                    const fraudMap = new Map<number, IFraudAssessment>();

                    for(let row of rows){                        

                        if(!fraudMap.has(row.id)){
                            fraudMap.set(row.id, {
                                accountHash: row.account_hash,
                                score: row.score,
                                level: "",
                                reasons: [],
                                createdAt: row.created_at,
                            });
                        }

                        if (row.reason) {
                            fraudMap.get(row.id)!.reasons.push(row.reason);
                        }

                    }

                    resolve(Array.from(fraudMap.values()));
                }
            );
        })

    }















    convertItemDatabaseToModel(item: FraudAssessmentModelDB, rows: FraudAssessmentReasonModelDB[]): IFraudAssessment{
    
        let reasons = rows.map(m => m.reason);

        let fraud: IFraudAssessment = {
            accountHash: item.account_hash,
            score: item.score,
            level: item.level,
            reasons: reasons,
            createdAt: item.created_at
        };

        return fraud;
    }


}