import { Checkout } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class ItensNeverPurchaseValidation implements Validation{
    
    validation(checkouts: Checkout[], score: number): number{
        if(checkouts.length <= 1) {return 0}

        let lastCheckout = checkouts[0];

        let copiedCheckouts = Array.from(checkouts);
        copiedCheckouts.shift();

        let itensNeverPurchase = false;

        for(let item of lastCheckout.itens){
            let itensBuyed = copiedCheckouts.filter((f) => f.itens.filter((i) => i.type == item.type));
            if(itensBuyed.length == 0){
                itensNeverPurchase = true;
                break;
            }
        }

        return itensNeverPurchase ? score : 0 ;
    }

   

    
}