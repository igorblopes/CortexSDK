
import { CortexDatabase } from './infra/database/cortex-db';
import { RootDatabase } from './infra/database/root-db';
import { CheckoutServices } from './services/checkout-services';
import { FingerprintServices } from './services/fingerprint-services';
import { FraudServices } from './services/fraud-services';
import { SenseServices } from './services/sense-services';
import { FraudAnalyzer } from './validations/fraud-analyzer';

export { CortexDatabase } from './infra/database/cortex-db';
export { RootDatabase } from './infra/database/root-db';


export class BackendSDK {

    db: any = new CortexDatabase();
    constructor(){

    }


    /*
     * initialize database and seed the tables
    */
    async init() {
        let rootDB = new RootDatabase();
        this.db = new CortexDatabase();

        await this.db.init(rootDB);
    }


    /*
     * RESPONSE
     *
     * id: number;
     * score: number;
     * level: string;
     */
    async allSenseScores() {
        let senseService = new SenseServices(this.db.senseScoreDB);

        return await new Promise<any[]>((resolve, reject) => {

            senseService.getAllSenseScore()
                .then((resp) => {
                    resolve(resp)
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }


    
    async intakeData(request: any) {

        return await new Promise<void>((resolve, reject) => {
            switch (request.typeData) {
                case "IntakeUserBehavior":
                    //TODO: criar todo os metodos do user behavior
                    resolve();
                    break;
                case "IntakeLogin":
                    this.createFingerprint(request.data)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    break;
                case "IntakeCheckout":
                    this.createCheckout(request.data)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    break;
                default:
                    reject();
                    break;
            }
        })
        
    }

    /*
     * REQUEST
     *
     * accountHash: string;
     * browserAgent: string;
     * connectionType: string;
     * device: string;
     * deviceType: string;
     * ip: string;
     * language: string;
     * locality: UserLocality;
     * operatingSystem: string;
     * screenResolution: number[];
     * soVersion: string;
     * timezone: string;
     * 
     */
    async createFingerprint(request: any) {
        let fingerprintService = new FingerprintServices(this.db.fingerprintDB);

        return await new Promise<void>((resolve, reject) => {
            fingerprintService.createFingerprint(request)
                .then(() => {
                    resolve()
                })
                .catch((err) => {
                    reject(err);
                });


        });
    }

    /*
     * REQUEST
     *
     * accountHash: string;
     * browserAgent: string;
     * itens: CheckoutItens[];
     * 
     */
    async createCheckout(request: any) {
        let checkoutServices = new CheckoutServices(this.db.checkoutDB);

        return await new Promise<void>((resolve, reject) => {
            checkoutServices.createFingerprint(request)
                .then(() => {
                    resolve()
                })
                .catch((err) => {
                    reject(err);
                });

        });
    }

    /*
     * REQUEST
     *
     * accountHash: string;
     * 
     * RESPONSE
     * 
     * accountHash: string;
     * score: number;
     * level: string | undefined;
     * reasons: string[];
     * createdAt: Date;
     * 
     */
    async validateFraud(accountHash: any) {
        let fraudAnalyzer = new FraudAnalyzer(this.db.checkoutDB, this.db.fingerprintDB, this.db.userBehaviorDB, this.db.fraudDB, this.db.senseScoreDB);
        let fraudServices = new FraudServices(fraudAnalyzer);
        return await new Promise<any>((resolve, reject) => {
            fraudServices.getAnalyzerFromAccountHash(accountHash)
                .then((resp) => {
                    resolve(resp)
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }



}
