import * as sqlite3 from 'sqlite3';
import { ICheckout, ICheckoutItens, IUpdateCheckoutScore } from '../../interfaces';
import { CheckoutModelDB, ConfigModelDB } from '../../interfaces-db';

export class CheckoutDB {

    constructor(private db: sqlite3.Database){}

    
    async createCheckoutEntity(checkout: ICheckout) {
        
        return await new Promise<void>((resolve, reject) => {
            let db = this.db;

            this.createCheckout(checkout)
                .then((resp) => {

                     for(let item of checkout.itens){

                        db.run(`
                            INSERT INTO checkout_itens (type, quantity, unityvalue, checkout_id)
                            VALUES ('${item.typeItem}', '${item.quantity}', '${Math.round(item.unitValue)}', '${resp}') 
                        `,function (err) {

                            if(err) reject(err);

                            resolve();
                        });
                    }

                })
                .catch((err) => reject(err))

        });
    }





    async updateCheckoutScore(request: IUpdateCheckoutScore): Promise<ConfigModelDB> {
                
            let context = this;
            return await new Promise<ConfigModelDB>((resolve, reject) => {
                this.db.run(
                    `
                        UPDATE checkout_score set score = '${request.score}', status = '${request.status}' WHERE id = '${request.id}'
                    ` 
                    ,function (err) {
    
                        if(err) reject(err);
    
                        context.getById(request.id)
                            .then((resp) => resolve(resp))
                            .catch((err) => reject(err))
                    }
                );
                        
            });
        }
    
        async getById(id: any): Promise<ConfigModelDB> {
            return await new Promise<ConfigModelDB>((resolve, reject) => {
    
                this.findAllCheckoutScore()
                    .then((resp: ConfigModelDB[]) =>{
    
                        let out = resp.filter(f => f.id == id);
                        resolve(out[0]);
    
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
        const rows = await this.all(
            this.db,
            `
            SELECT
            c.id,
            c.created_at,
            ci.id          AS item_id,
            ci.type        AS item_type,
            ci.quantity    AS item_quantity,
            ci.unityvalue  AS item_unityvalue,
            ci.checkout_id AS item_checkout_id
            FROM checkout c
            LEFT JOIN checkout_itens ci ON ci.checkout_id = c.id
            WHERE c.account_hash = ?
            ORDER BY c.id
            `,
            [accountHash]
        );

        if (!rows.length) return [];

        // Agrupa por checkout.id
        const byCheckout = new Map<number, ICheckout>();

        for (const r of rows) {
            // cria o checkout se ainda não existir
            let checkout = byCheckout.get(r.id);
            if (!checkout) {
                checkout = {
                    accountHash: "",
                    createdAt: this.parseCustomDate(r.created_at),
                    itens: [],
                };
                byCheckout.set(r.id, checkout);
            }

            // Se houver item (LEFT JOIN pode trazer nulos)
            if (r.item_checkout_id != null) {
                checkout.itens.push({
                    typeItem: r.item_type ?? null,
                    quantity: r.item_quantity ?? null,
                    unitValue: r.item_unityvalue ?? null,
                });
            }
        }

        return Array.from(byCheckout.values());
    }

    

    convertItemDatabaseToModel(itemCheckout: CheckoutModelDB, itemCheckoutItens: any[]): ICheckout{
    
        let dateCreatedAt = this.parseCustomDate(itemCheckout.created_at);

        let checkoutItens: ICheckoutItens[] = [];

        itemCheckoutItens.forEach((f) => {
            checkoutItens.push({
                quantity: f.quantity,
                typeItem: f.type,
                unitValue: f.unityvalue
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

    all<T = any>(db: any, sql: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) =>
            db.all(sql, params, (err: any, rows: T[]) => (err ? reject(err) : resolve(rows)))
        );
    }

    parseCustomDate(str: string): Date {
        const [datePart, timePart] = str.split(", ");

        const [day, month, year] = datePart.split("/").map(Number);

        const [h, m, s, ms] = timePart.split(":");

        return new Date(
            year,
            month - 1,      
            day,
            Number(h),
            Number(m),
            Number(s),
            Number(ms)
        );
    }


    

}