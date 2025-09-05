import { ICheckout } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class FirstBuyBiggerThan2000 implements Validation{
    
    validation(checkouts: ICheckout[], score: number): number{
        
        let size = checkouts.length;
        
        if(size < 1) {return 0} 

        let lastCheckout = checkouts[size - 1];
        
        let finalTotal = 0;
        
        for(let item of lastCheckout.itens){
            let total = item.unitValue * item.quantity;
            finalTotal += total;
        }

        return finalTotal > 2000 ? score : 0;
    }

   

    
}