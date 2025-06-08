import sqlite3 from 'sqlite3';
import { Checkout } from '../../interfaces';
import { CheckoutModelDB } from '../../interfacesDB';

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
                SELECT "Page change difference less than 5 seconds", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Page change difference less than 5 seconds");
            `);

            await this.db.run(`
                INSERT INTO checkout_score (name, score, status)
                SELECT "Page change difference less than 2 seconds", 30, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Page change difference less than 2 seconds");
            `);

            await this.db.run(`
                INSERT INTO checkout_score (name, score, status)
                SELECT "Mean clicks less than 5 seconds", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Mean clicks less than 5 seconds");
            `);

            await this.db.run(`
                INSERT INTO checkout_score (name, score, status)
                SELECT "Mean clicks less than 2 seconds", 20, 1
                WHERE NOT EXISTS(SELECT 1 FROM checkout_score WHERE name = "Mean clicks less than 5 seconds");
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