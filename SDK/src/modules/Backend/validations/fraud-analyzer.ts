import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { FraudDB } from "../infra/database/cortext-db-fraud";
import { SenseScoreDB } from "../infra/database/cortext-db-sense-score";
import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { FraudAssessment } from "../interfaces";
import { ScoreMappers } from "./score-mappers";

export class FraudAnalyzer {

    scoreMappers = new ScoreMappers(this.checkoutDB, this.fingerprintDB, this.userBehaviorDB);
    
    constructor(
        private checkoutDB: CheckoutDB,
        private fingerprintDB: FingerprintDB,
        private userBehaviorDB: UserBehaviorDB,
        private fraudDB: FraudDB,
        private senseScoreDB: SenseScoreDB
    ) {
        
    }

    async analyze(accountHash: string): Promise<FraudAssessment> {

        let mapScores = await this.senseScoreDB.getMapAllSenseScore();

        const results = await Promise.all([
            this.analyzeFingerprints(accountHash, mapScores),
            this.analyzeCheckouts(accountHash, mapScores),
            this.analyzeUserBehaviors(accountHash, mapScores)
        ]);


        let fingerprintResult = results[0];
        let checkoutResult = results[1];
        let userBehaviorResult = results[2];

        let score = fingerprintResult.score + checkoutResult.score + userBehaviorResult.score;

        let reasons = fingerprintResult.reasons.concat(checkoutResult.reasons, userBehaviorResult.reasons);

        let fraudResult: FraudAssessment = {
            accountHash: accountHash,
            score: score,
            level: mapScores.has(score) ? mapScores.get(score) : "allow",
            reasons: reasons,
            createdAt: new Date()
        };

        this.fraudDB.createFraudEntity(fraudResult);

        return fraudResult;

    }


    async analyzeFingerprints(accountHash: string, mapScores: Map<number, string>): Promise<FraudAssessment> {

        let fingerprints = await this.fingerprintDB.findFingerprintsByAccountHash(accountHash);

        let map = await this.scoreMappers.getMap();

        let reasons: string[] = [];
        let score = 0;

        for( const [chave, valor] of map.entries() ){
            let scoreValidation = valor != undefined ? valor.validation(fingerprints, chave.score) : 0;
            
            if(scoreValidation > 0){
                score += scoreValidation;
                reasons.push(chave.name);
            }
            
        }

        return {
            accountHash: accountHash,
            score: score,
            level: mapScores.has(score) ? mapScores.get(score) : "allow",
            reasons: reasons,
            createdAt: new Date()
        };
    }


    async analyzeCheckouts(accountHash: string, mapScores: Map<number, string>): Promise<FraudAssessment> {

        let checkouts = await this.checkoutDB.findCheckoutsByAccountHash(accountHash);

        let map = await this.scoreMappers.getMap();

        let reasons: string[] = [];
        let score = 0;

        for( const [chave, valor] of map.entries() ){
            let scoreValidation = valor != undefined ? valor.validation(checkouts, chave.score) : 0;
            
            if(scoreValidation > 0){
                score += scoreValidation;
                reasons.push(chave.name);
            }
            
        }

        return {
            accountHash: accountHash,
            score: score,
            level: mapScores.has(score) ? mapScores.get(score) : "allow",
            reasons: reasons,
            createdAt: new Date()
        };
    }


    async analyzeUserBehaviors(accountHash: string, mapScores: Map<number, string>): Promise<FraudAssessment> {

        let userBehaviors = await this.userBehaviorDB.findUserBehaviorByAccountHash(accountHash);

        let map = await this.scoreMappers.getMap();

        let reasons: string[] = [];
        let score = 0;

        for( const [chave, valor] of map.entries() ){
            let scoreValidation = valor != undefined ? valor.validation(userBehaviors, chave.score) : 0;
            
            if(scoreValidation > 0){
                score += scoreValidation;
                reasons.push(chave.name);
            }
            
        }

        return {
            accountHash: accountHash,
            score: score,
            level: mapScores.has(score) ? mapScores.get(score) : "allow",
            reasons: reasons,
            createdAt: new Date()
        };
    }
}