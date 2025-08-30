import { IFingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class LocalityValidation implements Validation{
    
    validation(fingerprints: IFingerprint[], score: number): number{
        if(fingerprints.length <= 1) {return 0}

        let lastFingerprint = fingerprints[0];

        const count = fingerprints.filter((f) => f.locality.latitude == lastFingerprint.locality.latitude && f.locality.longitude == lastFingerprint.locality.longitude).length;

        // TODO: Make travel validation

        return count <= 0 ? score : 0;
    }
}