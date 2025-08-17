import { Fingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class SOVersionValidation implements Validation{
    
    validation(fingerprints: Fingerprint[], score: number): number{
        if(fingerprints.length <= 1) {return 0}

        let lastFingerprint = fingerprints[0];

        const count = fingerprints.filter((f) => f.soVersion == lastFingerprint.soVersion).length;

        return count <= 0 ? score : 0;
    }
}