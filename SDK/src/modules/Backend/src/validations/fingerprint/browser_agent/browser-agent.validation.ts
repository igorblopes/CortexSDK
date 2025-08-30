import { IFingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class BrowserAgentValidation implements Validation{
    
    validation(fingerprints: IFingerprint[], score: number): number{
        if(fingerprints.length <= 1) {return 0}

        let lastConnection = fingerprints[0];

        const count = fingerprints.filter((f) => f.browserAgent == lastConnection.browserAgent).length;

        return count <= 0 ? score : 0;
    }
}