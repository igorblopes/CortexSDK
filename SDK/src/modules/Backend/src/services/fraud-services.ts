import { IFraudAssessment } from "../interfaces";
import { FraudAnalyzer } from "../validations/fraud-analyzer";

export class FraudServices {

    constructor(private fraudAnalyzer: FraudAnalyzer){}

    async getAnalyzerFromAccountHash(accountHash: string): Promise<IFraudAssessment> {
        return await this.fraudAnalyzer.analyze(accountHash);
    }

}