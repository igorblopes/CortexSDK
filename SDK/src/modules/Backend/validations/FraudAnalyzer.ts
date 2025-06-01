import { Fingerprint, FraudAssessment } from "../interfaces";

export class FraudAnalizer {

    analyze(fingerprint: Fingerprint): FraudAssessment {



        return {
            score: 0,
            level: "allow",
            reasons: [],
            createdAt: new Date()
        };
    }
}