import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { ConfigModelDB } from "../interfaces-db";
import { ConnectionValidation } from "./connections/connection.validation";
import { DeviceValidation } from "./device/device.validation";
import { Validation } from "./validation.interface";

export class ScoreMappers {
    
    constructor(
        private checkoutDB: CheckoutDB,
        private fingerprintDB: FingerprintDB,
        private userBehaviorDB: UserBehaviorDB
    ) {}

    async getMap(): Promise<Map<ConfigModelDB, Validation | undefined>> {

        let checkoutScores = await this.checkoutDB.findAllCheckoutScore();
        let fingerprintScores = await this.fingerprintDB.findAllFingerprintScore();
        let userBehaviorScores = await this.userBehaviorDB.findAllUserBehaviorScore();

        let mapNameToValidation = this.getMapNameScoreToClassValidation();

        let map = new Map<ConfigModelDB, Validation | undefined>();


        for(let score of checkoutScores) {
            if(score.status != 1) {continue;}

            if(mapNameToValidation.has(score.name)){
                map.set(score, mapNameToValidation.get(score.name));
            }
        }

        for(let score of fingerprintScores) {
            if(score.status != 1) {continue;}

            if(mapNameToValidation.has(score.name)){
                map.set(score, mapNameToValidation.get(score.name));
            }
        }

        for(let score of userBehaviorScores) {
            if(score.status != 1) {continue;}

            if(mapNameToValidation.has(score.name)){
                map.set(score, mapNameToValidation.get(score.name));
            }
        }

        return map;
    }

    getMapNameScoreToClassValidation(): Map<string, Validation> {
        let map = new Map<string, Validation>;

        // Fingerprints
        //map.set("Its new locality", );
        map.set("Its new device", new ConnectionValidation());
        //map.set("Its new ip", );
        //map.set("Its new language", );
        //map.set("Its new timezone", );
        map.set("Its different wifi connection", new DeviceValidation());
        //map.set("Its new screen resolution", );
        //map.set("Its new system operation", );
        //map.set("Its new so version", );
        //map.set("Its new browser agent", );
    

        // Checkouts
        //map.set("Itens types never purchased before", );
        //map.set("Quantity itens never purchased before", );
        //map.set("Total value 30% of purchase above mean", );
        //map.set("Total value 50% of purchase above mean", );
        //map.set("Total value 100% of purchase above mean", );


        // User Behaviors
        //map.set("Page change difference less than 5 seconds", );
        //map.set("Page change difference less than 2 seconds", );
        //map.set("Mean clicks less than 5 seconds", );
        //map.set("Mean clicks less than 2 seconds", );


        return map;
    }
}