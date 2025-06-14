import { Checkout } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class TotalValue30PercentValidation implements Validation{
    
    validation(checkouts: Checkout[], score: number): number{
        if(checkouts.length <= 1) {return 0}

        let lastCheckout = checkouts[0];

        let totalValuePurchaseLastCheckout = 0;
        lastCheckout.itens.forEach((i)  => totalValuePurchaseLastCheckout += (i.quantity * i.unitValue));

        let meanOtherPurchases = this.calculateMeanOtherPurchases(checkouts);
        let possibleFraud = false;

        if(meanOtherPurchases > 0) {
            let percentage = (totalValuePurchaseLastCheckout * 100 / meanOtherPurchases) - 100;
            if(percentage >= 30){
                possibleFraud = true;
            }
        }

        return possibleFraud ? score : 0 ;
    }

    calculateMeanOtherPurchases(checkouts: Checkout[]): number {
        let copiedCheckouts = Array.from(checkouts);
        copiedCheckouts.shift();


        const sizeCheckouts = copiedCheckouts.length;
        if(sizeCheckouts >= 1){
            let totalOtherPurchases = 0;
            for(let checkout of copiedCheckouts) {
                checkout.itens.forEach((i) => totalOtherPurchases += (i.quantity * i.unitValue));
            }

            return totalOtherPurchases / sizeCheckouts;

        }

        return 0;
    }
}