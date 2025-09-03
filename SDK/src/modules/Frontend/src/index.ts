import { ICheckout } from "../../Backend/src/interfaces";
import { CollectConnections } from "./collectors/connections/collect-connections";
import { CollectDevice } from "./collectors/device/collect-device";
import { CollectIp } from "./collectors/ip/collect-ip";
import { CollectLanguage } from "./collectors/language/collect-language";
import { CollectLocality } from "./collectors/locality/collect-locality";
import { CollectOperationSystem } from "./collectors/operating_system/collect-operation-system";
import { CollectScreenResolution } from "./collectors/resolution/collect-resolution";
import { CollectTimezone } from "./collectors/timezone/collect-timezone";
import { CollectVersion } from "./collectors/version/collect-version";

export { ICheckout, ICheckoutItens } from "../../Backend/src/interfaces";

export class FrontendSDK {

    private serviceBase: any = null;
    private token: string = "";

    
    private collectConnection: CollectConnections = new CollectConnections();
    private collectIp: CollectIp = new CollectIp();
    private collectResolution: CollectScreenResolution = new CollectScreenResolution();
    private collectLocality: CollectLocality = new CollectLocality();
    private collectDevice: CollectDevice = new CollectDevice();
    private collectTimezone: CollectTimezone = new CollectTimezone();
    private collectLanguage: CollectLanguage = new CollectLanguage();
    private collectOperationSystem: CollectOperationSystem = new CollectOperationSystem();
    private collectVersion: CollectVersion = new CollectVersion();

    /**
     * @hidden 
     */
    constructor(){

    }


     /**
     * @category [00.INICIALIZAÇÃO] - Start do SDK
     * 
     * @remarks
     * Realiza a inicialização do SDK Frontend e seta a base url do seu backend.
     * 
     * @param serviceBase -> Url do serviço base onde está localizado o seu SDK Backend
     * @param token -> x-api-token para validação entre a comunicação entre os SDK's de Frontend e Backend.
     * 
     * 
     */
    init(serviceBase: any, token: string) {
        this.serviceBase = serviceBase;
        this.token = token;
    }


    /**
     *
     * @category [01.INGESTÃO DE DADOS] - Ingestão de dados de Fingerprint
     *  
     * @remarks
     * Coleta os dados para fingerprint e envia automaticamente para o SDK de BACKEND
     *
     * @param accountHash -> Hash da conta que esta sendo coletado os dados
     * 
     *
     */
    async sendFingerprintData(accountHash: string) {
        return await new Promise<void>((resolve, reject) => {
            
            let body = {
                "typeData": "IntakeLogin",
                "data": {
                    "accountHash": accountHash,
                    "ip": this.collectIp.getIp(),
                    "connectionType": this.collectConnection.getConnectionType(),
                    "screenResolution": this.collectResolution.getScreenResolution(),
                    "locality": this.collectLocality.getLocality(),
                    "device": this.collectDevice.getDevice(),
                    "timezone": this.collectTimezone.getTimezone(),
                    "language": this.collectLanguage.getLanguage(),
                    "operationSystem": this.collectOperationSystem.getOperationSystem(),
                    "soVersion": this.collectVersion.getVersion(),
                    "deviceType": this.collectDevice.getDeviceType(),
                    "browserAgent": this.collectDevice.getBrowserAgent(),
                    "createdAt": new Date().toString()
                }
            };

            this.makeIntakeDataRequest(body)
                .then(() => resolve())
                .catch((err) => reject(err));

        });
    }    


    /**
     *
     * @category [01.INGESTÃO DE DADOS] - Ingestão de dados do Checkout da compra
     *  
     * @remarks
     * Coleta os dados para checkout de compra e envia automaticamente para o SDK de BACKEND
     *
     * @param accountHash -> Hash da conta que esta sendo coletado os dados
     * 
     *
     */
    async sendCheckoutData(request: ICheckout) {

        return await new Promise<void>((resolve, reject) => {

            let body = {
                "typeData": "IntakeCheckout",
                "data": {
                    "accountHash": request.accountHash,
                    "itens": request.itens,
                    "createdAt": new Date().toString()
                }
            };

             this.makeIntakeDataRequest(body)
                .then(() => resolve())
                .catch((err) => reject(err));

        });
    }


    
     /**
     * @hidden 
     */
    async makeIntakeDataRequest(body: { typeData: string; data: any }) {
        return await new Promise<void>((resolve, reject) => {
            fetch(this.serviceBase + "/api/v1/intake/data", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.token
                },
                body: JSON.stringify(body),
            })
            .then(() => resolve())
            .catch((err) => reject(err));
        });
    }


     /**
     * @hidden 
     */
    async backendPing() {
        return await new Promise<void>((resolve, reject) => {
            fetch(this.serviceBase + "/api/v1/ping", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.token
                }
            })
            .then(() => resolve())
            .catch((err) => reject(err));
        });
    }
    
}