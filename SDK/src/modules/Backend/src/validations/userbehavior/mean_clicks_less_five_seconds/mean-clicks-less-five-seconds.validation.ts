import { IUserBehavior } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class MeanClicksLessFiveSeconds implements Validation{


    validation(userBehaviors: IUserBehavior[], score: number): number {
        let size = userBehaviors.length;

        if(size < 1) {return 0}

        let lastConnection = userBehaviors[0];

        let mean = this.calculateMean(lastConnection);

        return mean < 5 ? score : 0;
    }

    calculateMean(userBehavior: IUserBehavior) {

        let clicks = userBehavior.clicks;

        let secondsClicks = [];

        let dates = clicks.map((m) => this.parseCustomDate(m.createdAt));

        dates.sort((a, b) => a.getTime() - b.getTime())

        for (let i = 1; i < dates.length; i++) {
            const diffMs = dates[i].getTime() - dates[i - 1].getTime();
            const seconds = Math.floor(diffMs / 1000);
            secondsClicks.push(seconds);
        }

        let sum = this.getSum(secondsClicks);

        let mean = sum / secondsClicks.length;

        return Math.floor(mean);

    }

    getSum(secondsClicks: number[]) {
        let sum = 0;
        let i = 0;
        while (i < secondsClicks.length) {
            sum += secondsClicks[i];
            i++;
        }

        return sum;
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