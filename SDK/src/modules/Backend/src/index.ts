
import { CortexDatabase } from './infra/database/cortex-db';
import { RootDatabase } from './infra/database/root-db';
import { CheckoutServices } from './services/checkout-services';
import { FingerprintServices } from './services/fingerprint-services';
import { SenseServices } from './services/sense-services';

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






    //  async getLevelByScore(score: string): Promise<string> {
    //     let senseService = new SenseServices(this.db.senseScoreDB);
    //     return await senseService.getLevelByScore(score);
    //  }

    // async getFraudByAccountHash(accountHash: string): Promise<FraudAssessment[]> {
    //     let fraudService = new FraudServices(this.db.fraudDB);
    //     return await fraudService.findFraudByAccountHash(accountHash);
    // }
}
