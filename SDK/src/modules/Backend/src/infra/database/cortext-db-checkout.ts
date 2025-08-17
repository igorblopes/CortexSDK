import * as sqlite3 from 'sqlite3';
import { Checkout, CheckoutItens } from '../../interfaces';
import { CheckoutItensModelDB, CheckoutModelDB, ConfigModelDB } from '../../interfaces-db';

export class CheckoutDB {

    constructor(private db: sqlite3.Database){}

    
    async createCheckoutEntity(checkout: Checkout) {
        
        return await new Promise<void>((resolve, reject) => {
            let db = this.db;
            this.db.run(`
                INSERT INTO checkout (account_hash, created_at)
                VALUES (${checkout.accountHash}, ${checkout.createdAt})
            `,(err: any, row: any) => {

                if(err) reject(err);

                let lastID = row.lastID;

                let inserts = [];
                let errors = [];

                for(let item of checkout.itens){

                    db.run(`
                         INSERT INTO checkout_itens (type, quantity, unity_value, checkout_id)
                         VALUES (${item.type}, ${item.quantity}, ${item.unitValue}, ${lastID}) 
                    `,(err: any, rows: any) => {

                        if(err) errors.push(err);

                        inserts.push(rows);

                        resolve();
                    });
                }


                let totalItens = inserts.length + errors.length;
                let checkoutItens = checkout.itens ? checkout.itens.length : 0;
                while(totalItens < checkoutItens){
                    totalItens = inserts.length + errors.length;
                    checkoutItens = checkout.itens ? checkout.itens.length : 0;
                }

                resolve();

            });

        });
    }


    async findCheckoutsByAccountHash(accountHash: string): Promise<Checkout[]> {
    
        let checkouts: Checkout[] = [];
        let context = this;

        await this.db.all<CheckoutModelDB>(`
            SELECT * FROM checkout WHERE account_hash = ${accountHash}
        `, function(err, rows) {

            if (err) {
                console.error('Erro ao Buscar:', err.message);
                return;
            }
            
            for(let item of rows){
                if(item != null){

                    context.db.all<CheckoutItensModelDB>(`
                        SELECT * FROM checkout_itens WHERE checkout_id = ${item.id}
                    `, function(err, rowsItens) {

                        if (err) {
                            console.error('Erro ao Buscar:', err.message);
                            return;
                        }

                        checkouts.push(
                            context.convertItemDatabaseToModel(item, rowsItens)
                        )
                    })

                }
            }

        });

        checkouts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        return checkouts;

    }

    convertItemDatabaseToModel(itemCheckout: CheckoutModelDB, itemCheckoutItens: CheckoutItensModelDB[]): Checkout{
    
        let dateCreatedAt = new Date(itemCheckout.created_at);

        let checkoutItens: CheckoutItens[] = [];

        itemCheckoutItens.forEach((f) => {
            checkoutItens.push({
                quantity: f.quantity,
                type: f.type,
                unitValue: f.unit_value
            });
        });

        let checkout: Checkout = {
            accountHash: itemCheckout.account_hash,
            itens: checkoutItens,
            createdAt: dateCreatedAt
        };

        return checkout;
    }

    async findAllCheckoutScore(): Promise<ConfigModelDB[]> {
        let all: ConfigModelDB[] = [];
        
        try {

            await this.db.all<ConfigModelDB>(`
                SELECT * FROM checkout_score
            `, function(err, rows) {

                if (err) {
                    console.error('Erro ao Buscar:', err.message);
                    return;
                }

                for(let row of rows) {
                    all.push({
                        id: row.id,
                        name: row.name,
                        score: row.score,
                        status: row.status
                    });
                }

            });            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }

        return all;
    }


    

}