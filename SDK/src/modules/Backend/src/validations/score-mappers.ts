import { CheckoutDB } from "../infra/database/cortext-db-checkout";
import { FingerprintDB } from "../infra/database/cortext-db-fingerprint";
import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { ConfigModelDB } from "../interfaces-db";
import { FirstBuyBiggerThan2000 } from "./checkout/first_buy_bigger_2000/first-buy-bigger-than-2000.validation";
import { ItensNeverPurchaseValidation } from "./checkout/itens_never_purchase/itens-never-purchase.validation";
import { QuantityItensPurchaseValidation } from "./checkout/quantity_itens_purchase/quantity-itens-purchase.validation";
import { TotalValue100PercentValidation } from "./checkout/total_value_100/total-value-100-perc.validation";
import { TotalValue30PercentValidation } from "./checkout/total_value_30/total-value-30-perc.validation";
import { TotalValue50PercentValidation } from "./checkout/total_value_50/total-value-50-perc.validation";
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
import { MeanClicksLessFiveSeconds } from "./userbehavior/mean_clicks_less_five_seconds/mean-clicks-less-five-seconds.validation";
import { MeanClicksLessTwoSeconds } from "./userbehavior/mean_clicks_less_two_seconds/mean-clicks-less-two-seconds.validation";
import { PageDifferenceLessFiveSeconds } from "./userbehavior/page_difference_less_five_seconds/page-difference-less-five-seconds.validation";
import { PageDifferenceLessTwoSeconds } from "./userbehavior/page_difference_less_two_seconds/page-difference-less-two-seconds.validation";
import { Validation } from "./validation.interface";

export class ScoreMappers {
    
    constructor(
        private checkoutDB: CheckoutDB,
        private fingerprintDB: FingerprintDB,
        private userBehaviorDB: UserBehaviorDB
    ) {}


    async getMapFingerprint(): Promise<Map<ConfigModelDB, Validation | undefined>> {

        return await new Promise<Map<ConfigModelDB, Validation | undefined>>((resolve, reject) => {

            this.fingerprintDB.findAllFingerprintScore()
                .then((fingerprintScores) => {

                    let mapNameToValidation = this.getMapFingerprintsScoreToClassValidation();

                    let map = new Map<ConfigModelDB, Validation | undefined>();        

                    for(let score of fingerprintScores) {
                        if(score.status != 1) {continue;}

                        if(mapNameToValidation.has(score.name)){
                            map.set(score, mapNameToValidation.get(score.name));
                        }
                    }
                    
                    resolve(map);
                })
                .catch((err) => reject(err));

        });

        
        
    }

    async getMapCheckout(): Promise<Map<ConfigModelDB, Validation | undefined>> {

        return await new Promise<Map<ConfigModelDB, Validation | undefined>>((resolve, reject) => {

            this.checkoutDB.findAllCheckoutScore()
                .then((checkoutScores) => {

                    let mapNameToValidation = this.getMapScoreUserCheckoutsToClassValidation();

                    let map = new Map<ConfigModelDB, Validation | undefined>();


                    for(let score of checkoutScores) {
                        if(score.status != 1) {continue;}

                        if(mapNameToValidation.has(score.name)){
                            map.set(score, mapNameToValidation.get(score.name));
                        }
                    }

                    resolve(map);

                })
                .catch((err) => reject(err));
        });

        
    }

    async getMapUserBehavior(): Promise<Map<ConfigModelDB, Validation | undefined>> {
        return await new Promise<Map<ConfigModelDB, Validation | undefined>>((resolve, reject) => {

            this.userBehaviorDB.allUserBehaviorScore()
                .then((userBehaviorScores) => {

                    let mapNameToValidation = this.getMapUserBehaviorsScoreToClassValidation();

                    let map = new Map<ConfigModelDB, Validation | undefined>();

                    for(let score of userBehaviorScores) {
                        if(score.status != 1) {continue;}

                        if(mapNameToValidation.has(score.name)){
                            map.set(score, mapNameToValidation.get(score.name));
                        }
                    }

                    resolve(map);

                })
                .catch((err) => reject(err))
            
        });
    }


    getMapUserBehaviorsScoreToClassValidation(): Map<string, Validation> {
        let map = new Map<string, Validation>();
   

        // User Behaviors
        map.set("Page change difference less than 5 seconds", new PageDifferenceLessFiveSeconds());
        map.set("Page change difference less than 2 seconds", new PageDifferenceLessTwoSeconds());
        map.set("Mean clicks less than 5 seconds", new MeanClicksLessFiveSeconds());
        map.set("Mean clicks less than 2 seconds", new MeanClicksLessTwoSeconds());
       


        return map;
    }


    getMapFingerprintsScoreToClassValidation(): Map<string, Validation> {
        let map = new Map<string, Validation>();

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

        return map;
    }


    getMapScoreUserCheckoutsToClassValidation(): Map<string, Validation> {
        let map = new Map<string, Validation>();

        // Checkouts
        map.set("Itens types never purchased before", new ItensNeverPurchaseValidation());
        map.set("Quantity itens never purchased before", new QuantityItensPurchaseValidation());
        map.set("Total value 30% of purchase above mean", new TotalValue30PercentValidation());
        map.set("Total value 50% of purchase above mean", new TotalValue50PercentValidation() );
        map.set("Total value 100% of purchase above mean", new TotalValue100PercentValidation() );
        map.set("First Buy Bigger Than 2000", new FirstBuyBiggerThan2000());

        return map;
    }
}