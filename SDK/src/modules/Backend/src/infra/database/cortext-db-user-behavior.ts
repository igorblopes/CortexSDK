import * as sqlite3 from 'sqlite3';
import { IUpdateUserBehaviorScore, IUserBehavior, IUserBehaviorClicks } from '../../interfaces';
import { ConfigModelDB, UserBehaviorClicksModelDB, UserBehaviorModelDB } from '../../interfaces-db';

export class UserBehaviorDB {

    constructor(private db: sqlite3.Database){}
     
    async allUserBehaviorScore(): Promise<ConfigModelDB[]> {
        
        let all: ConfigModelDB[] = [];
        return await new Promise<ConfigModelDB[]>((resolve, reject) => {

            this.db.all(
                `
                SELECT * FROM user_behavior_score
                `
                ,(err: any, rows: any[]) => {

                    if (err) {
                        reject(err);
                    }

                    for(let row of rows) {
                        all.push({
                            id: row.id,
                            name: row.name,
                            score: row.score,
                            status: row.status
                        });
                    }

                    resolve(all);
                }
            )

        });
    }

    async createUserBehaviorEntity(userBehavior: IUserBehavior) {

        return await new Promise<void>((resolve, reject) => {
        
            let db = this.db;

            this.createUserBehavior(userBehavior)
                .then((resp) => {

                    if(userBehavior.clicks && userBehavior.clicks.length > 0){

                        for(let click of userBehavior.clicks){
                        
                            db.run(`
                                INSERT INTO user_behavior_clicks (element_click, created_at, user_behavior_id)
                                VALUES ('${click.elementClick}', '${click.createdAt}' ,'${resp}') 
                            `,function (err) {

                                if(err) reject(err);

                                resolve();
                            });
                        }
                    }else{
                        resolve();
                    }


                })
                .catch((err) => reject(err))

        });
    }


    async createUserBehavior(userBehavior: IUserBehavior) {
        return await new Promise<number>((resolve, reject) => {
        
            this.db.run(`
                INSERT INTO user_behavior (account_hash, page_visit, session_duration, created_at)
                VALUES ('${userBehavior.accountHash}', '${userBehavior.pageVisit}', '${userBehavior.sessionDuration}', '${userBehavior.createdAt}')
            `,function (err) {

                if(err) reject(err);

                resolve(this.lastID);
            });

        });

    }




    async findUserBehaviorByAccountHash(accountHash: string): Promise<IUserBehavior[]> {
        return await new Promise<IUserBehavior[]>((resolve, reject) => {

            let userBehaviors: IUserBehavior[] = [];
            let context = this;

            this.db.all(
                `
                    SELECT * FROM user_behavior WHERE account_hash = '${accountHash}'
                `
                ,(err: any, rows: any[]) => {

                    if (err) {
                        reject(err);
                    }

                    if(!rows || rows.length == 0) {
                        resolve(userBehaviors);
                    }
                    
                    for(let item of rows){
                        if(item != null){

                            context.db.all(
                                `
                                    SELECT * FROM user_behavior_clicks WHERE user_behavior_id = '${item.id}'
                                `
                                ,(err: any, rows: any[]) => {

                                    if (err) {
                                        reject(err);
                                    }

                                    userBehaviors.push(
                                        context.convertItemDatabaseToModel(item, rows)
                                    );

                                    //TODO: Validate sort with string
                                    //userBehaviors.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

                                    resolve(userBehaviors);


                                }
                            )

                        }
                    }
                }
            );


        });
        
        
    }


    async updateUserBehaviorScore(request: IUpdateUserBehaviorScore): Promise<ConfigModelDB> {
            
        let context = this;
        return await new Promise<ConfigModelDB>((resolve, reject) => {
            this.db.run(
                `
                    UPDATE user_behavior_score set score = '${request.score}', status = '${request.status}' WHERE id = '${request.id}'
                ` 
                ,function (err) {

                    if(err) reject(err);

                    context.getById(request.id)
                        .then((resp) => resolve(resp))
                        .catch((err) => reject(err))
                }
            );
                    
        });
    }

    async getById(id: any): Promise<ConfigModelDB> {
        return await new Promise<ConfigModelDB>((resolve, reject) => {

            this.allUserBehaviorScore()
                .then((resp: ConfigModelDB[]) =>{

                    let out = resp.filter(f => f.id == id);
                    resolve(out[0]);

                })
                .catch((err) => reject(err))
        });
    }



    
    convertItemDatabaseToModel(item: UserBehaviorModelDB, rows: UserBehaviorClicksModelDB[]): IUserBehavior{
    
        let dateCreatedAt = item.created_at;
        let clicks: IUserBehaviorClicks[] = [];
        
        for(let row of rows) {
            let dateCreatedAt = row.created_at;
            clicks.push({
                elementClick: row.element_click,
                createdAt: dateCreatedAt
            })
        }

        let userBehavior: IUserBehavior = {
            accountHash: item.account_hash,
            pageVisit: item.page_visit,
            sessionDuration: item.session_duration,
            clicks: clicks,
            createdAt: dateCreatedAt
        };

        return userBehavior;
    }

}