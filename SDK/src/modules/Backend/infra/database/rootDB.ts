import sqlite3 from 'sqlite3';
import { Fingerprint, FraudAssessment, UserBehavior } from '../../interfaces';
import { FingerprintDB } from './cortextDBFingerprint';
import { FraudDB } from './cortextDBFraud';
import { UserBehaviorDB } from './cortextDBUserBehavior';
import { CheckoutDB } from './cortextDBCheckout';

export class RootDatabase {

    path = "cortex.db";
    db = new sqlite3.Database(this.path);

    getDbInstance(): sqlite3.Database {
        return this.db;
    }

    

    






    



}