import { FraudDB } from "../infra/database/cortext-db-fraud";
import { SenseScoreDB } from "../infra/database/cortext-db-sense-score";
import { ICounters, IFraudAssessment } from "../interfaces";
import { FraudAnalyzer } from "../validations/fraud-analyzer";

export class FraudServices {

    constructor(private fraudAnalyzer: FraudAnalyzer, private fraudDB: FraudDB, private senseScore: SenseScoreDB){}

    async getAnalyzerFromAccountHash(accountHash: string): Promise<IFraudAssessment> {
        return await this.fraudAnalyzer.analyze(accountHash);
    }

    async getFraudsByFilters(filters: any): Promise<IFraudAssessment[]> {
        if(filters != filters) filters = filters;

        let allFrauds = await this.fraudDB.findAllFrauds();

        let mapScore = await this.senseScore.getMapAllSenseScore();

        for(let fraud of allFrauds){
            fraud.level = mapScore.has(fraud.score) ? mapScore.get(fraud.score) : "allow"
        }

        return allFrauds;

    }

    async getCountersFrauds(): Promise<ICounters> {

        let allFrauds = await this.fraudDB.findAllFrauds();

        let mapScore = await this.senseScore.getMapAllSenseScore();

        for(let fraud of allFrauds){
            fraud.level = mapScore.has(fraud.score) ? mapScore.get(fraud.score) : "allow"
        }
        

        let allow = allFrauds.filter((f) => f.level == "allow").length;
        let review = allFrauds.filter((f) => f.level == "review").length;
        let deny = allFrauds.filter((f) => f.level == "deny").length;

        let response: ICounters = {
            allow: allow,
            review: review,
            deny: deny
        };

        return response;
    }

}