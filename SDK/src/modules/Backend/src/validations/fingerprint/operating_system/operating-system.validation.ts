import { IFingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class OperatingSystemValidation implements Validation{
    
    validation(fingerprints: IFingerprint[], score: number): number{
        if(fingerprints.length <= 1) {return 0}

        let lastFingerprint = fingerprints[0];

        const count = fingerprints.filter((f) => f.operatingSystem == lastFingerprint.operatingSystem).length;

        return count <= 0 ? score : 0;
    }
}