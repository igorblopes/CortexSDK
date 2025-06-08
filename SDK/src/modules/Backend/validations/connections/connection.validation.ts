import { Fingerprint } from "../../interfaces";
import { Validation } from "../validation.interface";

export class ConnectionValidation implements Validation{
    
    validation(fingerprints: Fingerprint[], score: number): number{
        if(fingerprints.length <= 1) {return 0}

        let lastConnection = fingerprints[0].connectionType;

        const count = fingerprints.filter((f) => f.connectionType == lastConnection).length;

        return count <= 0 ? score : 0;
    }
}