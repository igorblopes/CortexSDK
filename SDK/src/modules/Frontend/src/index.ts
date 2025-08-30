import { CollectConnections } from "./collectors/connections/collect-connections";
import { CollectDevice } from "./collectors/device/collect-device";
import { CollectIp } from "./collectors/ip/collect-ip";
import { CollectLanguage } from "./collectors/language/collect-language";
import { CollectLocality } from "./collectors/locality/collect-locality";
import { CollectOperationSystem } from "./collectors/operating_system/collect-operation-system";
import { CollectScreenResolution } from "./collectors/resolution/collect-resolution";
import { CollectTimezone } from "./collectors/timezone/collect-timezone";
import { CollectVersion } from "./collectors/version/collect-version";

export class FrontendSDK {

    serviceBase: any = null;

    collectConnection: CollectConnections = new CollectConnections();
    collectIp: CollectIp = new CollectIp();
    collectResolution: CollectScreenResolution = new CollectScreenResolution();
    collectLocality: CollectLocality = new CollectLocality();
    collectDevice: CollectDevice = new CollectDevice();
    collectTimezone: CollectTimezone = new CollectTimezone();
    collectLanguage: CollectLanguage = new CollectLanguage();
    collectOperationSystem: CollectOperationSystem = new CollectOperationSystem();
    collectVersion: CollectVersion = new CollectVersion();

    constructor(){

    }

    init(serviceBase: any) {
        this.serviceBase = serviceBase;
    }

    async sendFingerprintData(accountHash: any) {
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

    async sendCheckoutData(request: any) {

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


    
    async backendPing() {
        return await new Promise<void>((resolve, reject) => {
            fetch(this.serviceBase + "/api/v1/ping", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(() => resolve())
            .catch((err) => reject(err));
        });
    }



     async makeIntakeDataRequest(body: { typeData: string; data: any }) {
        return await new Promise<void>((resolve, reject) => {
            fetch(this.serviceBase + "/api/v1/intake/data", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            .then(() => resolve())
            .catch((err) => reject(err));
        });
    }
    
}