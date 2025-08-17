//import * as sqlite3 from 'sqlite3';


type SqliteCallback = (err: unknown, rowOrRows?: unknown) => void;
type SqliteDatabase = {
  run(sql: string, params: unknown[] | undefined, cb: SqliteCallback): void;
  get(sql: string, params: unknown[] | undefined, cb: SqliteCallback): void;
  all(sql: string, params: unknown[] | undefined, cb: SqliteCallback): void;
  close(cb: (err: unknown) => void): void;
};

export class RootDatabase {

    private db!: any;

    path = "cortex.db";
    //db = new sqlite3.Database(this.path);

    dbInstance(): any {
        //return this.db;

        const sqlite: any = require('sqlite3').verbose();
        if(!this.db){
            this.db = new sqlite.Database(this.path) as SqliteDatabase;
            return this.db;
        }

        return this.db;
    }

    

    






    



}