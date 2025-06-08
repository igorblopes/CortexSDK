import { Fingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class ResolutionValidation implements Validation{
    
    validation(fingerprints: Fingerprint[], score: number): number{
        if(fingerprints.length <= 1) {return 0}

        let lastFingerprint = fingerprints[0];

        const count = fingerprints.filter((f) => f.screenResolution[0] == lastFingerprint.screenResolution[0] && f.screenResolution[1] == lastFingerprint.screenResolution[1]).length;

        return count <= 0 ? score : 0;
    }
}