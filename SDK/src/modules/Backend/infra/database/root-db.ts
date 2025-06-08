import sqlite3 from 'sqlite3';
import { Fingerprint, FraudAssessment, UserBehavior } from '../../interfaces';
import { FingerprintDB } from './cortext-db-fingerprint';
import { FraudDB } from './cortext-db-fraud';
import { UserBehaviorDB } from './cortext-db-user-behavior';
import { CheckoutDB } from './cortext-db-checkout';

export class RootDatabase {

    path = "cortex.db";
    db = new sqlite3.Database(this.path);

    getDbInstance(): sqlite3.Database {
        return this.db;
    }

    

    






    



}