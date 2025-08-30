import { IFingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class DeviceValidation implements Validation{
    
    validation(fingerprints: IFingerprint[], score: number): number{
        if(fingerprints.length <= 1) {return 0}

        let lastFingerprint = fingerprints[0];

        const countDevice = fingerprints.filter((f) => f.device == lastFingerprint.device).length;
        const countDeviceType = fingerprints.filter((f) => f.deviceType == lastFingerprint.deviceType).length;

        const count = countDevice + countDeviceType;

        return count <= 0 ? score : 0;
    }
}