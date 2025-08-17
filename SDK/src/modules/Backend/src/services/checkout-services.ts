import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { Checkout } from "../interfaces";

export class CheckoutServices {

    constructor(private checkoutDB: CheckoutDB){}

    
    async createFingerprint(request: any): Promise<void> {
        let entity: Checkout = {
            accountHash: request.accountHash,
            itens: request.itens,
            createdAt: new Date()
        };

        return await this.checkoutDB.createCheckoutEntity(entity);
    }


}