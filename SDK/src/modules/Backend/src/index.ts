
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
     /**
     * @hidden 
     */
    constructor(){

    }


    /**
     * @category [00.INICIALIZAÇÃO] - Start do SDK
     * @remarks
     * 
     * Realiza a inicialização do SDK Backend e faz a verificação de integridade do banco de dados.
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
     *
     * @category [01.INGESTÃO DE DADOS] - Ingestão de dados por tipo
     *  
     * @remarks
     * Recebe os dados do SDK Frontend para futuras análises. Ponto de entrada da coleta de dados.
     *
     * @param request -> Dados de coleta para futuras análises.
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



    /**
     * @category [02.FRAUDE] - Validações
     * 
     * @remarks
     * Cria a validação de fraud de uma conta, salva no banco de dados e responde com a validação feita. 
     *
     * @param accountHash -> Hash da conta que deseja ser analisada
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


    /**
     * 
     * @category [03.AUXILIAR] - Ingestão de dados de fingerprint.
     * 
     * @remarks
     * Cria ingestão de fingerprint do usuário
     * 
     * @param request -> Dados de coleta do fingerprint do usuário
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

    /**
     * @category [03.AUXILIAR] - Ingestão de dados de checkout da compra.
     *
     * @remarks
     * Cria ingestão de checkout de compras do usuário
     * 
     * @param request -> Dados de coleta do checkout de compras do usuário
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


    /**
     * @category [03.AUXILIAR] - Ingestão de dados de comportamento do usuário.
     * 
     * @remarks
     * Cria ingestão de dados de comportamentos do usuário
     * 
     * @param request -> Dados de coleta do comportamento do usuário
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

 



}
