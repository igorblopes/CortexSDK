import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { ICheckout, IIntakeData } from "../interfaces";

export class CheckoutServices {

    constructor(private checkoutDB: CheckoutDB){}

    
    async createCheckout(request: IIntakeData): Promise<void> {
        let entity: ICheckout = {
            accountHash: request.data.accountHash,
            itens: request.data.itens,
            createdAt: request.data.createdAt
        };

        return await this.checkoutDB.createCheckoutEntity(entity);
    }


}