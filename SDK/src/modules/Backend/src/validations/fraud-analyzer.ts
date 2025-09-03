import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { FraudDB } from "../infra/database/cortext-db-fraud";
import { SenseScoreDB } from "../infra/database/cortext-db-sense-score";
import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { IFraudAssessment } from "../interfaces";
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

    async analyze(accountHash: string): Promise<IFraudAssessment> {
        return await new Promise<IFraudAssessment>((resolve, reject) => {

            try{
                this.senseScoreDB.getMapAllSenseScore()
                    .then((mapScores) => {

                        this.getAnalyseResults(accountHash, mapScores)
                            .then((results) => {

                                let fingerprintIndice = 0;
                                let checkoutIndice = 1;
                                let userBehaviorIndice = 2;

                                let score = 0;
                                let reasons: string[] = [];

                                this.processResult(results, fingerprintIndice, score, reasons);
                                this.processResult(results, checkoutIndice, score, reasons);
                                this.processResult(results, userBehaviorIndice, score, reasons);


                                let fraudResult: IFraudAssessment = {
                                    accountHash: accountHash,
                                    score: score,
                                    level: mapScores.has(score) ? mapScores.get(score) : "allow",
                                    reasons: reasons,
                                    createdAt: new Date()
                                };

                                this.fraudDB.createFraudEntity(fraudResult)
                                    .then(() => resolve(fraudResult))
                                    .catch((err) => reject(err));

                                

                            })
                            .catch((err) => reject(err));


                    })
                    .catch((err) => reject(err));
            }catch(err){
                reject(err)
            }
        });
    }

    processResult(results: any[], indice: number, score: number, reasons: string[]) {
        if(results.length > indice){
            let result = results[indice];
            score += result.score;
            for(let reason of result.reasons){
                reasons.push(reason)

            }
        }
    }

    async getAnalyseResults(accountHash:string, mapScores: Map<number, string>): Promise<any[]>{
        return await new Promise<any[]>((resolve, reject) => {
            let results = [];
            
            this.analyzeFingerprints(accountHash, mapScores)
                .then((respFingerprint) => {

                    results.push(respFingerprint);
                    this.analyzeCheckouts(accountHash, mapScores)
                        .then((respCheckouts) => {

                            results.push(respCheckouts);
                            this.analyzeUserBehaviors(accountHash, mapScores)
                                .then((respUserBehaviors) => {

                                    results.push(respUserBehaviors);
                                    resolve(results);                                

                                })
                                .catch((err) => reject(err))

                        })
                        .catch((err) => reject(err))

                })
                .catch((err) => reject(err))
        });
    }


    async analyzeFingerprints(accountHash: string, mapScores: Map<number, string>): Promise<IFraudAssessment> {

        let fingerprints = await this.fingerprintDB.findFingerprintsByAccountHash(accountHash);

        let map = await this.scoreMappers.getMapFingerprint();

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


    async analyzeCheckouts(accountHash: string, mapScores: Map<number, string>): Promise<IFraudAssessment> {

        let checkouts = await this.checkoutDB.findCheckoutsByAccountHash(accountHash);

        let map = await this.scoreMappers.getMapCheckout();

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


    async analyzeUserBehaviors(accountHash: string, mapScores: Map<number, string>): Promise<IFraudAssessment> {

        let userBehaviors = await this.userBehaviorDB.findUserBehaviorByAccountHash(accountHash);

        let map = await this.scoreMappers.getMapUserBehavior();

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