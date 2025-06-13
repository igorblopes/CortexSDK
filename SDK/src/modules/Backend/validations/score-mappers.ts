import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { ConfigModelDB } from "../interfaces-db";
import { BrowserAgentValidation } from "./fingerprint/browser_agent/browser-agent.validation";
import { ConnectionValidation } from "./fingerprint/connections/connection.validation";
import { DeviceValidation } from "./fingerprint/device/device.validation";
import { IpValidation } from "./fingerprint/ip/ip.validation";
import { LanguageValidation } from "./fingerprint/language/language.validation";
import { LocalityValidation } from "./fingerprint/locality/locality.validation";
import { OperatingSystemValidation } from "./fingerprint/operating_system/operating-system.validation";
import { ResolutionValidation } from "./fingerprint/resolution/resolution.validation";
import { TimezoneValidation } from "./fingerprint/timezone/timezone.validation";
import { SOVersionValidation } from "./fingerprint/version/so-version.validation";
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
        map.set("Its new locality", new LocalityValidation());
        map.set("Its new device", new DeviceValidation());
        map.set("Its new ip", new IpValidation());
        map.set("Its new language", new LanguageValidation());
        map.set("Its new timezone", new TimezoneValidation());
        map.set("Its different wifi connection", new ConnectionValidation());
        map.set("Its new screen resolution", new ResolutionValidation());
        map.set("Its new system operation", new OperatingSystemValidation());
        map.set("Its new so version", new SOVersionValidation());
        map.set("Its new browser agent", new BrowserAgentValidation());
    

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