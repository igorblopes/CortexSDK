import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { ICheckout, IIntakeData, IUpdateCheckoutScore } from "../interfaces";
import { ConfigModelDB } from "../interfaces-db";

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

    async getAllCheckoutScore(): Promise<ConfigModelDB[]> {
        return await this.checkoutDB.findAllCheckoutScore();
    }

    async updateCheckoutScore(request: IUpdateCheckoutScore): Promise<ConfigModelDB> {
        return await this.checkoutDB.updateCheckoutScore(request);
    }


}