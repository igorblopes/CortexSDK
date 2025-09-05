import { IUserBehavior } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class MeanClicksLessFiveSeconds implements Validation{


    validation(userBehaviors: IUserBehavior[], score: number): number {
        let size = userBehaviors.length;

        if(size <= 1) {return 0}

         let lastConnection = userBehaviors[size-1];

         let mean = this.calculateMean(lastConnection);

        return mean < 5 ? score : 0;
    }

    calculateMean(userBehavior: IUserBehavior) {

        let clicks = userBehavior.clicks;

        let secondsClicks = [];

        let dates = clicks.map((m) => this.parseCustomDate(m.createdAt));

        for (let i = 1; i < dates.length; i++) {
            const diffMs = dates[i].getTime() - dates[i - 1].getTime();
            secondsClicks.push(Math.floor(diffMs / 1000));
        }

        let sum = secondsClicks.reduce((acc, valor) => acc + valor, 0);

        let mean = sum / secondsClicks.length;

        return mean;

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