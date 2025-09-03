
import { CortexDatabase } from './infra/database/cortex-db';
import { RootDatabase } from './infra/database/root-db';
import { IIntakeData } from './interfaces';
import { CheckoutServices } from './services/checkout-services';
import { FingerprintServices } from './services/fingerprint-services';
import { FraudServices } from './services/fraud-services';
import { SenseServices } from './services/sense-services';
import { UserServices } from './services/user-services';
import { FraudAnalyzer } from './validations/fraud-analyzer';


export { IIntakeData, IUserBehavior, ICheckout, ICheckoutItens, IFingerprint, IUserBehaviorClicks, IUserLocality } from './interfaces';


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
    private token: string = "";
     /**
     * @hidden 
     */
    constructor(){

    }


    /**
     * @category [00.INICIALIZAÇÃO] - Start do SDK
     * 
     * @remarks
     * Realiza a inicialização do SDK Backend e faz a verificação de integridade do banco de dados.
     * 
     * @param token -> x-api-token para validação entre a comunicação entre os SDK's de Frontend e Backend.
     */
    async init(token: string) {
        let rootDB = new RootDatabase();
        this.db = new CortexDatabase();

        this.token = token;

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
     * @param token -> x-api-token para validação entre a comunicação entre os SDK's de Frontend e Backend.
     * 
     *
     */
    async intakeData(request: IIntakeData, token: string): Promise<void> {
        return await new Promise<void>((resolve, reject) => {

            if(this.token != null && token != this.token) {
                reject("Token nulo ou inválido.")
            }

            switch (request.typeData) {
                case "IntakeUserBehavior":
                    this.createUserBehavior(request, token)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    break;
                case "IntakeLogin":
                    this.createFingerprint(request, token)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    break;
                case "IntakeCheckout":
                    this.createCheckout(request, token)
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
     * @param token -> x-api-token para validação entre a comunicação entre os SDK's de Frontend e Backend.
     * 
     */
    async validateFraud(accountHash: string, token: string): Promise<any> {
        let fraudAnalyzer = new FraudAnalyzer(this.db.checkoutDB, this.db.fingerprintDB, this.db.userBehaviorDB, this.db.fraudDB, this.db.senseScoreDB);
        let fraudServices = new FraudServices(fraudAnalyzer);
        return await new Promise<any>((resolve, reject) => {

            if(this.token != null && token != this.token) {
                reject("Token nulo ou inválido.")
            }

            fraudServices.getAnalyzerFromAccountHash(accountHash)
                .then((resp) => {
                    resolve(resp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }


    async teste() {
        
        return await new Promise<any>((resolve, reject) => {
            try{
                let resp = {
                    accaaountHash: "aa",
                    level: "allow",
                    score: 0,
                    createdAt: new Date(),
                    reasons: []
                };
                resolve(resp);

            }catch(err){
                reject(err);
            }

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
     * @param token -> x-api-token para validação entre a comunicação entre os SDK's de Frontend e Backend.
     * 
     */
    async createFingerprint(request: IIntakeData, token: string) {
        let fingerprintService = new FingerprintServices(this.db.fingerprintDB);

        return await new Promise<void>((resolve, reject) => {
            
            if(this.token != null && token != this.token) {
                reject("Token nulo ou inválido.")
            }

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
     * @param token -> x-api-token para validação entre a comunicação entre os SDK's de Frontend e Backend.
     * 
     */
    async createCheckout(request: IIntakeData, token: string) {
        let checkoutServices = new CheckoutServices(this.db.checkoutDB);

        return await new Promise<void>((resolve, reject) => {

            if(this.token != null && token != this.token) {
                reject("Token nulo ou inválido.")
            }

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
     * @param token -> x-api-token para validação entre a comunicação entre os SDK's de Frontend e Backend.
     * 
     */
    async createUserBehavior(request: IIntakeData, token: string) {
        let userServices = new UserServices(this.db.userBehaviorDB);

        return await new Promise<void>((resolve, reject) => {

            if(this.token != null && token != this.token) {
                reject("Token nulo ou inválido.")
            }

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
