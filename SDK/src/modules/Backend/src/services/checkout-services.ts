import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { Checkout } from "../interfaces";

export class CheckoutServices {

    constructor(private checkoutDB: CheckoutDB){}

    
    async createCheckout(request: any): Promise<void> {
        let entity: Checkout = {
            accountHash: request.data.accountHash,
            itens: request.data.itens,
            createdAt: request.data.createdAt
        };

        return await this.checkoutDB.createCheckoutEntity(entity);
    }


}