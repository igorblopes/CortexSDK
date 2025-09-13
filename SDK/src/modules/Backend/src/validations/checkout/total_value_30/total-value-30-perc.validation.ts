import { ICheckout } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class TotalValue30PercentValidation implements Validation{
    
    validation(checkouts: ICheckout[], score: number): number{
        let size = checkouts.length;

        if(size < 2) {return 0}

        checkouts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

        let lastCheckout = checkouts[size - 1];

        let copiedCheckoutWithoutLast = Array.from(checkouts);
        copiedCheckoutWithoutLast.pop();

        let totalValuePurchaseLastCheckout = 0;
        lastCheckout.itens.forEach((i)  => totalValuePurchaseLastCheckout += (i.quantity * i.unitValue));

        let meanOtherPurchases = this.calculateMeanOtherPurchases(copiedCheckoutWithoutLast);
        let possibleFraud = false;

        if(meanOtherPurchases > 0) {
            let percentage = (totalValuePurchaseLastCheckout * 100 / meanOtherPurchases) - 100;
            if(percentage >= 30){
                possibleFraud = true;
            }
        }

        return possibleFraud ? score : 0 ;
    }

    calculateMeanOtherPurchases(checkouts: ICheckout[]): number {

        const sizeCheckouts = checkouts.length;
        if(sizeCheckouts >= 1){
            let totalOtherPurchases = 0;
            for(let checkout of checkouts) {
                checkout.itens.forEach((i) => totalOtherPurchases += (i.quantity * i.unitValue));
            }

            return totalOtherPurchases / sizeCheckouts;

        }

        return 0;
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