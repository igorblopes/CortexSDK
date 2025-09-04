import * as sqlite3 from 'sqlite3';
import { ICheckout, ICheckoutItens } from '../../interfaces';
import { CheckoutItensModelDB, CheckoutModelDB, ConfigModelDB } from '../../interfaces-db';

export class CheckoutDB {

    constructor(private db: sqlite3.Database){}

    
    async createCheckoutEntity(checkout: ICheckout) {
        
        return await new Promise<void>((resolve, reject) => {
            let db = this.db;

            this.createCheckout(checkout)
                .then((resp) => {

                     for(let item of checkout.itens){

                        db.run(`
                            INSERT INTO checkout_itens (type, quantity, unity_value, checkout_id)
                            VALUES ('${item.typeItem}', '${item.quantity}', '${item.unitValue}', '${resp}') 
                        `,function (err) {

                            if(err) reject(err);

                            resolve();
                        });
                    }

                })
                .catch((err) => reject(err))

        });
    }


    async createCheckout(checkout: ICheckout) {
        return await new Promise<number>((resolve, reject) => {
            this.db.run(`
                INSERT INTO checkout (account_hash, created_at)
                VALUES ('${checkout.accountHash}', '${checkout.createdAt}')
            `,function (err) {

                if(err) reject(err);

                resolve(this.lastID);
            });

        });

    }


    async findCheckoutsByAccountHash(accountHash: string): Promise<ICheckout[]> {

        return await new Promise<ICheckout[]>((resolve, reject) => {

            let checkouts: ICheckout[] = [];
            let context = this;

            this.db.all(
            `
                SELECT * FROM checkout WHERE account_hash = '${accountHash}'
            `
            ,(err: any, rows: any[]) => {


                if (err) {
                    reject(err);
                }

                if(!rows || rows.length == 0) {
                    resolve(checkouts);
                }

                for(let item of rows){

                    if(item != null){

                        context.db.all(
                        `
                            SELECT * FROM checkout_itens WHERE checkout_id = '${item.id}'
                        `
                        ,(err: any, rowsItens: any[]) => {

                            if (err) {
                                reject(err);
                            }

                            if(!rowsItens) {
                                resolve(checkouts);
                            }

                            checkouts.push(
                                context.convertItemDatabaseToModel(item, rowsItens)
                            );

                            //checkouts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

                            resolve(checkouts);
                        })
                    }
                }

            });

        });

    }

    convertItemDatabaseToModel(itemCheckout: CheckoutModelDB, itemCheckoutItens: CheckoutItensModelDB[]): ICheckout{
    
        //let dateCreatedAt = new Date(itemCheckout.created_at);
        let dateCreatedAt = new Date();

        let checkoutItens: ICheckoutItens[] = [];

        itemCheckoutItens.forEach((f) => {
            checkoutItens.push({
                quantity: f.quantity,
                typeItem: f.type,
                unitValue: f.unit_value
            });
        });

        let checkout: ICheckout = {
            accountHash: itemCheckout.account_hash,
            itens: checkoutItens,
            createdAt: dateCreatedAt
        };

        return checkout;
    }

    async findAllCheckoutScore(): Promise<ConfigModelDB[]> {

        return await new Promise<ConfigModelDB[]>((resolve, reject) => {

            let all: ConfigModelDB[] = [];

            this.db.all(
                `
                    SELECT * FROM checkout_score
                `
                ,(err: any, rows: any[]) => {

                    if (err) {
                        reject(err);
                    }

                    for(let row of rows) {
                        all.push({
                            id: row.id,
                            name: row.name,
                            score: row.score,
                            status: row.status
                        });
                    }

                    resolve(all);

                }
            );      

        });
        
    }


    

}