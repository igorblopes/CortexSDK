import * as sqlite3 from 'sqlite3';

export class RootDatabase {

    path = "cortex.db";
    db = new sqlite3.Database(this.path);

    getDbInstance(): sqlite3.Database {
        return this.db;
    }

    

    






    



}