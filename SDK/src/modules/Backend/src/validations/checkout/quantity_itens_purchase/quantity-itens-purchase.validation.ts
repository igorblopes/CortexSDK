import { ICheckout } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class QuantityItensPurchaseValidation implements Validation{
    
    validation(checkouts: ICheckout[], score: number): number{
        if(checkouts.length <= 1) {return 0}

        let lastCheckout = checkouts[0];

        let totalQtdItensPurchases = 0;
        lastCheckout.itens.forEach((i)  => totalQtdItensPurchases += i.quantity);

        let meanOtherPurchases = this.calculateMeanTotalItensPurchases(checkouts);
        let possibleFraud = false;

        if(meanOtherPurchases > 0) {
            let percentage = (totalQtdItensPurchases * 100 / meanOtherPurchases) - 100;
            if(percentage >= 50){
                possibleFraud = true;
            }
        }

        return possibleFraud ? score : 0 ;
    }

    calculateMeanTotalItensPurchases(checkouts: ICheckout[]): number {
        let copiedCheckouts = Array.from(checkouts);
        copiedCheckouts.shift();


        const sizeCheckouts = copiedCheckouts.length;
        if(sizeCheckouts >= 1){
            let totalQtdItensOtherPurchases = 0;
            for(let checkout of copiedCheckouts) {
                checkout.itens.forEach((i) => totalQtdItensOtherPurchases += i.quantity);
            }

            return totalQtdItensOtherPurchases / sizeCheckouts;

        }

        return 0;
    }

    
}