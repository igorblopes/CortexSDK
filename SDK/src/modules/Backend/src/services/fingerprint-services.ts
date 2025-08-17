import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { Fingerprint } from "../interfaces";

export class FingerprintServices {

    constructor(private fingerprintDB: FingerprintDB){}

    
    async createFingerprint(request: any): Promise<void> {
        let entity: Fingerprint = {
            accountHash: request.accountHash,
            browserAgent: request.browserAgent,
            connectionType: request.connectionType,
            device: request.device,
            deviceType: request.deviceType,
            ip: request.ip,
            language: request.language,
            locality: request.locality,
            operatingSystem: request.operatingSystem,
            screenResolution: request.screenResolution,
            soVersion: request.soVersion,
            timezone: request.timezone,
            createdAt: new Date()
        };

        return await this.fingerprintDB.createFingerprintEntity(entity);
    }


}