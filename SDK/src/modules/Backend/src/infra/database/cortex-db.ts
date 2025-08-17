import { FingerprintDB } from './cortext-db-fingerprint';
import { FraudDB } from './cortext-db-fraud';
import { UserBehaviorDB } from './cortext-db-user-behavior';
import { CheckoutDB } from './cortext-db-checkout';
import { RootDatabase } from './root-db';
import { SenseScoreDB } from './cortext-db-sense-score';

export class CortexDatabase {

    db: any = null;
    fingerprintDB: any | FingerprintDB = null;
    fraudDB: any | FraudDB = null;
    userBehaviorDB: any | UserBehaviorDB = null;
    checkoutDB: any | CheckoutDB = null;
    senseScoreDB: any | SenseScoreDB = null;

    constructor(
    )
    {
        this.fingerprintDB = new FingerprintDB(this.db);
        this.fraudDB = new FraudDB(this.db);
        this.userBehaviorDB = new UserBehaviorDB(this.db);
        this.checkoutDB = new CheckoutDB(this.db);
        this.senseScoreDB = new SenseScoreDB(this.db);
    }
    
    
    async init(rootDB: RootDatabase) {

        try {
            this.db = rootDB.dbInstance();
            this.db.run(`PRAGMA foreign_keys = ON`);

            // Criacao da tabela principal de fraude
            await this.fraudDB.createTableFraud();

            // Criacao da tabela de sensiblidade do score
            await this.senseScoreDB.createTableSenseScore();



            // Criacao da tabela de fingerprint
            await this.fingerprintDB.createTableFingerprint();

            // Criacao da tabela de user behavior
            await this.userBehaviorDB.createTableUserBehavior();

            // Criacao da table de checkout
            await this.checkoutDB.createTableCheckout();
            

            
            // Criacao das tabela de config de scores
            await this.fingerprintDB.createTableFingerprintScore();
            await this.userBehaviorDB.createTableUserBehaviorScore();
            await this.checkoutDB.createTableCheckoutScore();

            // Seed das tabelas de config de scores
            await this.fingerprintDB.seedFingerprintScore();
            await this.userBehaviorDB.seedUserBehaviorScore();
            await this.checkoutDB.seedCheckoutScore();

            // Seed da tabela de sensibilidade de score
            await this.senseScoreDB.seedSenseScore();

            return {};
            
        } catch (err) {
            return err;
        } finally {
            this.db.close();
        }
    }

    

    






    



}