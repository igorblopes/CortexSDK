import { IFingerprint } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class TimezoneValidation implements Validation{
    
    validation(fingerprints: IFingerprint[], score: number): number{
        let size = fingerprints.length;

        if(size <= 1) {return 0}

        fingerprints.sort((a, b) => this.parseCustomDate(b.createdAt).getTime() - this.parseCustomDate(a.createdAt).getTime())

        let lastFingerprint = fingerprints[size-1];

        let copiedFingerprintsWithoutLast = Array.from(fingerprints);
        copiedFingerprintsWithoutLast.pop();

        let timezones = copiedFingerprintsWithoutLast.map((m) => m.timezone);

        let newTimezone = !timezones.includes(lastFingerprint.timezone);

        return newTimezone ? score : 0;
    }

    parseCustomDate(str: string): Date {
        const [datePart, timePart] = str.split(", ");

        const [day, month, year] = datePart.split("/").map(Number);

        const [h, m, s, ms] = timePart.split(":");

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