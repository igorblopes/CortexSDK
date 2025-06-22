import * as sqlite3 from 'sqlite3';
import { UserBehavior, UserBehaviorClicks } from '../../interfaces';
import { ConfigModelDB, UserBehaviorClicksModelDB, UserBehaviorModelDB } from '../../interfaces-db';

export class UserBehaviorDB {

    constructor(private db: sqlite3.Database){}



    
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

     
    async findAllUserBehaviorScore(): Promise<ConfigModelDB[]> {
        let all: ConfigModelDB[] = [];
        
        try {

            await this.db.all<ConfigModelDB>(`
                SELECT * FROM user_behavior_score
            `, function(err, rows) {

                if (err) {
                    console.error('Erro ao Buscar:', err.message);
                    return;
                }

                for(let row of rows) {
                    all.push({
                        id: row.id,
                        name: row.name,
                        score: row.score,
                        status: row.status
                    });
                }

            });            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }

        return all;
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






    async createTableUserBehavior() {
        try {
            await this.db.run(
                `CREATE TABLE IF NOT EXISTS user_behavior ( 
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
            await this.db.run(
                `CREATE TABLE IF NOT EXISTS user_behavior_clicks ( 
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    element_click TEXT,
                    created_at TEXT,
                    user_behavior_id INTEGER,
                    FOREIGN KEY (user_behavior_id) REFERENCES user_behavior(id)
                )
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




    async findUserBehaviorByAccountHash(accountHash: string): Promise<UserBehavior[]> {
        
        let userBehaviors: UserBehavior[] = [];
        let context = this;

        await this.db.all<UserBehaviorModelDB>(`
            SELECT * FROM user_behavior WHERE account_hash = ${accountHash}
        `, function(err, rows) {

            if (err) {
                console.error('Erro ao Buscar:', err.message);
                return;
            }
            
            for(let item of rows){
                if(item != null){

                    context.db.all<UserBehaviorClicksModelDB>(`
                        SELECT * FROM user_behavior_clicks WHERE user_behavior_id = ${item.id}
                    `, function(err, rows) {

                        if (err) {
                            console.error('Erro ao Buscar:', err.message);
                            return;
                        }

                        userBehaviors.push(
                            context.convertItemDatabaseToModel(item, rows)
                        );
                        
                    })

                }
            }

        });

        userBehaviors.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        return userBehaviors;
    }

    
    convertItemDatabaseToModel(item: UserBehaviorModelDB, rows: UserBehaviorClicksModelDB[]): UserBehavior{
    
        let dateCreatedAt = new Date(item.created_at);
        let clicks: UserBehaviorClicks[] = [];
        
        for(let row of rows) {
            let dateCreatedAt = new Date(row.created_at);
            clicks.push({
                elementClick: row.element_click,
                createdAt: dateCreatedAt
            })
        }

        let userBehavior: UserBehavior = {
            accountHash: item.account_hash,
            pageVisit: item.page_visit,
            sessionDuration: item.session_duration,
            clicks: clicks,
            createdAt: dateCreatedAt
        };

        return userBehavior;
    }

}