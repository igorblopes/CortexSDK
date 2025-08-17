import { FingerprintDB } from './cortext-db-fingerprint';
import { FraudDB } from './cortext-db-fraud';
import { UserBehaviorDB } from './cortext-db-user-behavior';
import { CheckoutDB } from './cortext-db-checkout';
import { RootDatabase } from './root-db';
import { SenseScoreDB } from './cortext-db-sense-score';
import { SeedDB } from './cortext-db-seeds';

export class CortexDatabase {

    db: any = null;
    seedDB: any | SeedDB = null;
    fingerprintDB: any | FingerprintDB = null;
    fraudDB: any | FraudDB = null;
    userBehaviorDB: any | UserBehaviorDB = null;
    checkoutDB: any | CheckoutDB = null;
    senseScoreDB: any | SenseScoreDB = null;

    constructor(
    )
    {
        this.seedDB = new SeedDB(this.db);
        this.fingerprintDB = new FingerprintDB(this.db);
        this.fraudDB = new FraudDB(this.db);
        this.userBehaviorDB = new UserBehaviorDB(this.db);
        this.checkoutDB = new CheckoutDB(this.db);
        this.senseScoreDB = new SenseScoreDB(this.db);
    }
    

    async init(rootDB: RootDatabase): Promise<void> {

        return await new Promise<void>((resolve, reject) => {
            this.loadDependecies(rootDB);
            this.db.run(`PRAGMA foreign_keys = ON`);
            this.seedDB.createTablesAndSeed()
                .then(() => resolve())
                .catch(() => reject());
        });

    }


    loadDependecies(rootDB: RootDatabase){
        this.db = rootDB.dbInstance();
        this.seedDB = new SeedDB(this.db);
        this.fingerprintDB = new FingerprintDB(this.db);
        this.fraudDB = new FraudDB(this.db);
        this.userBehaviorDB = new UserBehaviorDB(this.db);
        this.checkoutDB = new CheckoutDB(this.db);
        this.senseScoreDB = new SenseScoreDB(this.db);
    }

    

    






    



}