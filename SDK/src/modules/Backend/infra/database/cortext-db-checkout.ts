import sqlite3 from 'sqlite3';
import { Checkout } from '../../interfaces';
import { CheckoutModelDB, ConfigModelDB } from '../../interfaces-db';

export class CheckoutDB {

    constructor(private db: sqlite3.Database){}

    async createTableCheckout() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS checkout ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_hash TEXT,
                type TEXT, 
                quantity INTEGER, 
                unity_value REAL,
                created_at TEXT)
            `);            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async createCheckoutEntity(checkout: Checkout) {
        try {
            await this.db.run(`
                INSERT INTO checkout (account_hash, type, quantity, unity_value, created_at)
                VALUES (${checkout.accountHash}, ${checkout.type}, ${checkout.quantity}, ${checkout.unitValue}, ${checkout.createdAt})
            `);

            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }


    async findAllCheckoutScore(): Promise<ConfigModelDB[]> {
        let all: ConfigModelDB[] = [];
        
        try {

            await this.db.all<ConfigModelDB>(`
                SELECT * FROM checkout_score
            `, function(err, rows) {

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


    async createTableCheckoutScore() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS checkout_score ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT, 
                score INTEGER, 
                status INTEGER)
            `);            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async seedCheckoutScore() {
    
        try {
            await this.db.run(`
                INSERT INTO checkout_score (name, score, status)
                SELECT "Itens types never purchased before", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Itens types never purchased before");
            `);

            await this.db.run(`
                INSERT INTO checkout_score (name, score, status)
                SELECT "Quantity itens never purchased before", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Quantity itens never purchased before");
            `);

            await this.db.run(`
                INSERT INTO checkout_score (name, score, status)
                SELECT "Total value 30% of purchase above mean", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Total value 30% of purchase above mean");
            `);

            await this.db.run(`
                INSERT INTO checkout_score (name, score, status)
                SELECT "Total value 50% of purchase above mean", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Total value 50% of purchase above mean");
            `);

            await this.db.run(`
                INSERT INTO checkout_score (name, score, status)
                SELECT "Total value 100% of purchase above mean", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Total value 100% of purchase above mean");
            `);

            
            
        } catch (err) {
            console.error('Error creating seed checkout_score:', err);
        }
    }


    async findCheckoutsByAccountHash(accountHash: string): Promise<Checkout[]> {
    
        let checkouts: Checkout[] = [];
        let context = this;

        await this.db.all<CheckoutModelDB>(`
            SELECT * FROM checkout WHERE account_hash = ${accountHash}
        `, function(err, rows) {
            
            for(let item of rows){
                if(item != null){
                    checkouts.push(
                        context.convertItemDatabaseToModel(item)
                    )
                }
            }

        });

        checkouts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        return checkouts;

    }

    convertItemDatabaseToModel(item: CheckoutModelDB): Checkout{
    

        let dateCreatedAt = new Date(item.created_at);


        let checkout: Checkout = {
            accountHash: item.account_hash,
            type: item.type,
            quantity: item.quantity,
            unitValue: item.unit_value,
            createdAt: dateCreatedAt
        };

        return checkout;
    }

}