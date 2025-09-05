import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { IFingerprint, IIntakeData, IUpdateFingerprintScore } from "../interfaces";

export class FingerprintServices {

    constructor(private fingerprintDB: FingerprintDB){}

    
    async createFingerprint(request: IIntakeData): Promise<void> {
        let entity: IFingerprint = {
            accountHash: request.data.accountHash,
            browserAgent: request.data.browserAgent,
            connectionType: request.data.connectionType,
            device: request.data.device,
            deviceType: request.data.deviceType,
            ip: request.data.ip,
            language: request.data.language,
            locality: request.data.locality,
            operatingSystem: request.data.operatingSystem,
            screenResolution: request.data.screenResolution,
            soVersion: request.data.soVersion,
            timezone: request.data.timezone,
            createdAt: request.data.createdAt
        };

        return await this.fingerprintDB.createFingerprintEntity(entity);
    }


    async getAllFingerprintScore(): Promise<any> {
        return await this.fingerprintDB.findAllFingerprintScore();
    }

    async updateFingerprintScore(request: IUpdateFingerprintScore): Promise<any> {
        return await this.fingerprintDB.updateFingerprintScore(request);
    }


}