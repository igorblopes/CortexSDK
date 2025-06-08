import sqlite3 from 'sqlite3';
import { SenseScoreModelDB } from '../../interfaces-db';

export class SenseScoreDB {

    constructor(private db: sqlite3.Database){}


    async createTableSenseScore() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS sense_score ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                score INTEGER, 
                level TEXT)
            `);     
            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async findLevelByScore(score: string): Promise<string> {
    
        let level: string = "";
        

        await this.db.all<string>(`
            SELECT level FROM sense_score WHERE score = ${score}
        `, function(err, rows) {
            
            level = rows[0];
            

        });

        return level;
    }


    async seedSenseScore() {
        for (let i = 0; i <= 100; i++) {
            try {
                await this.db.run(`
                    INSERT INTO sense_score (score, level)
                    SELECT ${i}, ${this.getLevelFromScore(i)}
                    WHERE NOT EXISTS(SELECT 1 FROM sense_score WHERE score = ${i})
                `);
            } catch (err) {
                console.error('Error creating seed sense_score:', err);
            }
        }
    }


    getLevelFromScore(score: number){
        if(score <= 39) return "allow";
        if(score > 39 && score <= 79) return "review";
        if(score > 79) return "deny";
    }


    async getAllSenseScore(): Promise<SenseScoreModelDB[]> {
        let allSenseScore: SenseScoreModelDB[] = [];

        try {
            await this.db.all<SenseScoreModelDB>(`
                SELECT * FROM sense_score
            `, function(err, rows) {

                for(let row of rows) {
                    allSenseScore.push({
                        id: row.id,
                        score: row.score,
                        level: row.level
                    });
                }

            });
        } catch (err) {
            console.error('Error creating seed sense_score:', err);
        }

        return allSenseScore;
    }


    async getMapAllSenseScore(): Promise<Map<number, string>> {
        let allScores = await this.getAllSenseScore();

        let map: Map<number, string> = new Map<number, string>();
        
        for(let score of allScores){
            map.set(score.score, score.level);
        }


        return map;
    }
     

    


}