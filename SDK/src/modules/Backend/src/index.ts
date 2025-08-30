
import { CortexDatabase } from './infra/database/cortex-db';
import { RootDatabase } from './infra/database/root-db';
import { IFraudAssessment, IIntakeData } from './interfaces';
import { CheckoutServices } from './services/checkout-services';
import { FingerprintServices } from './services/fingerprint-services';
import { FraudServices } from './services/fraud-services';
import { SenseServices } from './services/sense-services';
import { UserServices } from './services/user-services';
import { FraudAnalyzer } from './validations/fraud-analyzer';


export { IFraudAssessment, IIntakeData, IUserBehavior, ICheckout, ICheckoutItens, IFingerprint, IUserBehaviorClicks, IUserLocality } from './interfaces';


/**
 * @hidden
 */
export { CortexDatabase } from './infra/database/cortex-db';
/**
 * @hidden
 */
export { RootDatabase } from './infra/database/root-db';



export class BackendSDK {

    private db: any = new CortexDatabase();
    constructor(){

    }


    /**
     * Realiza a inicializacao do SDK Backend e faz a verificacao de integridade do banco de dados
     */
    async init() {
        let rootDB = new RootDatabase();
        this.db = new CortexDatabase();

        await this.db.init(rootDB);
    }


    /**
     *
     * @hidden 
     *
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


    /**
     * Recebe os dados do SDK Frontend para futuras analises. Ponto de entrada da coleta de dados.
     * 
     * @param request -> Dados de coleta para futuras analises.
     * 
     *
     */
    async intakeData(request: IIntakeData): Promise<void> {

        return await new Promise<void>((resolve, reject) => {
            switch (request.typeData) {
                case "IntakeUserBehavior":
                    this.createUserBehavior(request)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    break;
                case "IntakeLogin":
                    this.createFingerprint(request)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    break;
                case "IntakeCheckout":
                    this.createCheckout(request)
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
    async createFingerprint(request: IIntakeData) {
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
    async createCheckout(request: IIntakeData) {
        let checkoutServices = new CheckoutServices(this.db.checkoutDB);

        return await new Promise<void>((resolve, reject) => {
            checkoutServices.createCheckout(request)
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
     * pageVisit: string;
     * clicks: UserBehaviorClicks[];
     * sessionDuration: number;
     * createdAt: Date;
     * 
     */
    async createUserBehavior(request: IIntakeData) {
        let userServices = new UserServices(this.db.userBehaviorDB);

        return await new Promise<void>((resolve, reject) => {
            userServices.createUserBehavior(request)
                .then(() => {
                    resolve()
                })
                .catch((err) => {
                    reject(err);
                });

        });
    }

    /**
     * 
     * Cria a validacao de fraud de uma conta, salva no banco de dados e responde com a validacao feita 
     *
     * @param accountHash -> hash da conta que deseja ser analisada
     * 
     * 
     */
    async validateFraud(accountHash: string): Promise<IFraudAssessment> {
        let fraudAnalyzer = new FraudAnalyzer(this.db.checkoutDB, this.db.fingerprintDB, this.db.userBehaviorDB, this.db.fraudDB, this.db.senseScoreDB);
        let fraudServices = new FraudServices(fraudAnalyzer);
        return await new Promise<IFraudAssessment>((resolve, reject) => {
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
