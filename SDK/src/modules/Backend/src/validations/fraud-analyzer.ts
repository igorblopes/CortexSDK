import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { FraudDB } from "../infra/database/cortext-db-fraud";
import { SenseScoreDB } from "../infra/database/cortext-db-sense-score";
import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { IFraudAssessment } from "../interfaces";
import { CollectDate } from "./date/collect-date";
import { ScoreMappers } from "./score-mappers";

export class FraudAnalyzer {

    scoreMappers = new ScoreMappers(this.checkoutDB, this.fingerprintDB, this.userBehaviorDB);

    private collectDate: CollectDate = new CollectDate();
    
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


                                let fingerprintResult = this.processResult(results, fingerprintIndice);
                                let checkoutResult = this.processResult(results, checkoutIndice);
                                let userBehaviorResult = this.processResult(results, userBehaviorIndice);


                                let score = userBehaviorResult.score + checkoutResult.score + fingerprintResult.score;
                                let reasons: string[] = fingerprintResult.reasons.concat(checkoutResult.reasons, userBehaviorResult.reasons);


                                let fraudResult: IFraudAssessment = {
                                    accountHash: accountHash,
                                    score: score,
                                    level: mapScores.has(score) ? mapScores.get(score) : "allow",
                                    reasons: reasons,
                                    createdAt: this.collectDate.getActualDate()
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

    processResult(results: any[], indice: number) {
        let score: number = 0;
        let reasons: any[] = [];

        if(results.length > indice){
            let result = results[indice];
            score = result.score;
            for(let reason of result.reasons){
                reasons.push(reason);
            }
        }

        return { score: score, reasons: reasons};
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

        return await new Promise<IFraudAssessment>((resolve, reject) => {

            this.scoreMappers.getMapFingerprint()
                .then(async (map) => {
                    this.fingerprintDB.findFingerprintsByAccountHash(accountHash)
                        .then(async (fingerprints) => {

                            let reasons: string[] = [];
                            let score = 0;

                            for( const [chave, valor] of map.entries() ){
                                let scoreValidation = valor != undefined ? valor.validation(fingerprints, chave.score) : 0;
                                
                                if(scoreValidation > 0){
                                    score += scoreValidation;
                                    reasons.push(chave.name);
                                }
                                
                            }

                            let response = {
                                accountHash: accountHash,
                                score: score,
                                level: mapScores.has(score) ? mapScores.get(score) : "allow",
                                reasons: reasons,
                                createdAt: this.collectDate.getActualDate()
                            };

                            resolve(response);
                            
                        })
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));            

        });        
    }


    async analyzeCheckouts(accountHash: string, mapScores: Map<number, string>): Promise<IFraudAssessment> {

        return await new Promise<IFraudAssessment>((resolve, reject) => {

            this.scoreMappers.getMapCheckout()
                .then((map) => {

                    this.checkoutDB.findCheckoutsByAccountHash(accountHash)
                        .then((checkouts) => {

                            let reasons: string[] = [];
                            let score = 0;

                            for( const [chave, valor] of map.entries() ){

                                let scoreValidation = valor?.validation(checkouts, chave.score);
                                
                                if(scoreValidation && scoreValidation > 0){
                                    score += scoreValidation;
                                    reasons.push(chave.name);
                                }
                            }

                            let response = {
                                accountHash: accountHash,
                                score: score,
                                level: mapScores.has(score) ? mapScores.get(score) : "allow",
                                reasons: reasons,
                                createdAt: this.collectDate.getActualDate()
                            };

                            resolve(response);

                        })
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });

        
    }


    async analyzeUserBehaviors(accountHash: string, mapScores: Map<number, string>): Promise<IFraudAssessment> {

        return await new Promise<IFraudAssessment>((resolve, reject) => {
            this.scoreMappers.getMapUserBehavior()
                .then(async (map) => {

                    this.userBehaviorDB.findUserBehaviorByAccountHash(accountHash)
                        .then(async (userBehaviors) => {

                            let reasons: string[] = [];
                            let score = 0;

                            for( const [chave, valor] of map.entries() ){
                                let scoreValidation = valor != undefined ? valor.validation(userBehaviors, chave.score) : 0;
                                
                                if(scoreValidation > 0){
                                    score += scoreValidation;
                                    reasons.push(chave.name);
                                }
                                
                            }

                            let response = {
                                accountHash: accountHash,
                                score: score,
                                level: mapScores.has(score) ? mapScores.get(score) : "allow",
                                reasons: reasons,
                                createdAt: this.collectDate.getActualDate()
                            };
                            
                            resolve(response);

                        })
                        .catch((err) => reject(err));

                    

                })
                .catch((err) => reject(err));
        });
        
    }
}