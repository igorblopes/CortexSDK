import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { FraudDB } from "../infra/database/cortext-db-fraud";
import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { FraudAssessment } from "../interfaces";
import { ConfigModelDB } from "../interfaces-db";
import { ScoreMappers } from "./score-mappers";
import { Validation } from "./validation.interface";

export class FraudAnalizer {

    scoreMappers = new ScoreMappers(this.checkoutDB, this.fingerprintDB, this.userBehaviorDB);
    
    constructor(
        private checkoutDB: CheckoutDB,
        private fingerprintDB: FingerprintDB,
        private userBehaviorDB: UserBehaviorDB,
        private fraudDB: FraudDB
    ) {
        
    }


    async analyzeFingerprints(accountHash: string): Promise<FraudAssessment> {

        let fingerprints = await this.fingerprintDB.findFingerprintsByAccountHash(accountHash);
        let frauds = await this.fraudDB.findFraudByAccountHash(accountHash);

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
            level: "allow",
            reasons: reasons,
            createdAt: new Date()
        };
    }


    async analyzeCheckouts(accountHash: string): Promise<FraudAssessment> {

        let checkouts = await this.checkoutDB.findCheckoutsByAccountHash(accountHash);
        let frauds = await this.fraudDB.findFraudByAccountHash(accountHash);

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
            level: "allow",
            reasons: reasons,
            createdAt: new Date()
        };
    }


    async analyzeUserBehaviors(accountHash: string): Promise<FraudAssessment> {

        let userBehaviors = await this.userBehaviorDB.findUserBehaviorByAccountHash(accountHash);
        let frauds = await this.fraudDB.findFraudByAccountHash(accountHash);

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
            level: "allow",
            reasons: reasons,
            createdAt: new Date()
        };
    }
}