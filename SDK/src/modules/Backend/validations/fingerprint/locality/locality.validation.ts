import { Fingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class LocalityValidation implements Validation{
    
    validation(fingerprints: Fingerprint[], score: number): number{
        if(fingerprints.length <= 1) {return 0}

        let lastFingerprint = fingerprints[0];

        const count = fingerprints.filter((f) => f.locality.lat == lastFingerprint.locality.lat && f.locality.long == lastFingerprint.locality.long).length;

        // TODO: Make travel validation

        return count <= 0 ? score : 0;
    }
}