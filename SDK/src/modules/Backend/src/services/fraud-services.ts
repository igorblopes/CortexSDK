import { FraudDB } from "../infra/database/cortext-db-fraud";
import { FraudAssessment } from "../interfaces";

export class FraudServices {

    constructor(private fraudDB: FraudDB){}

    async findFraudByAccountHash(accountHash: string): Promise<FraudAssessment[]> {
        return await this.fraudDB.findFraudByAccountHash(accountHash);
    }

}