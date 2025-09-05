import { IFingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class BrowserAgentValidation implements Validation{
    
    validation(fingerprints: IFingerprint[], score: number): number{
        let size = fingerprints.length;

        if(size <= 1) {return 0}

        fingerprints.sort((a, b) => this.parseCustomDate(b.createdAt).getTime() - this.parseCustomDate(a.createdAt).getTime())

        let lastConnection = fingerprints[size-1];

        let copiedFingerprintsWithoutLast = Array.from(fingerprints);
        copiedFingerprintsWithoutLast.pop();

        let browsersAgents = copiedFingerprintsWithoutLast.map((m) => m.browserAgent);

        let newAgent = !browsersAgents.includes(lastConnection.browserAgent);

        return newAgent ? score : 0;
    }



    parseCustomDate(str: string): Date {
        const [datePart, timePart] = str.split(", ");

        const [day, month, year] = datePart.split("/").map(Number);

        const [h, m, rest] = timePart.split(":");
        const [s, ms] = rest.split(":");

        return new Date(
            year,
            month - 1,      
            day,
            Number(h),
            Number(m),
            Number(s),
            Number(ms)
        );
    }
}