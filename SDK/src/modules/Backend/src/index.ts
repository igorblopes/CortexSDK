
import { CortexDatabase } from './infra/database/cortex-db';
import { RootDatabase } from './infra/database/root-db';
//import { FraudAssessment } from './interfaces';
//import { FraudServices } from './services/fraud-services';
import { SenseServices } from './services/sense-services';

export { CortexDatabase } from './infra/database/cortex-db';
export { RootDatabase } from './infra/database/root-db';


export class BackendSDK {

    db: any = new CortexDatabase();
    constructor(){

    }

    
    async init() {
        let rootDB = new RootDatabase();
        this.db = new CortexDatabase();

        await this.db.init(rootDB);
    }

    testa(): any {
        return {
            "Teste": "testesasdwasd"
        };
    }


    bla(): any {
        return {"a": "a"};
    }

    blb(): any {
        return {"b": "b"};
    }

    blc(): any {
        return {"c": "c"};
    }

    bld(): any {
        return {"d": "d"};
    }


    /*
     * id: number;
     * score: number;
     * level: string;
    */
    allSenseScores(): any{
        let senseService = new SenseServices(this.db.senseScoreDB);
        let done = false;
        let result: any[] = [];

        senseService.getAllSenseScore().then((res) => {
            result = res;
            done = true;
        }).catch(() => {
            done = true
        });

        while(!done){
            
        }

        return {
            "data": result.length
        };

    }



    //  async getLevelByScore(score: string): Promise<string> {
    //     let senseService = new SenseServices(this.db.senseScoreDB);
    //     return await senseService.getLevelByScore(score);
    //  }

    // async getFraudByAccountHash(accountHash: string): Promise<FraudAssessment[]> {
    //     let fraudService = new FraudServices(this.db.fraudDB);
    //     return await fraudService.findFraudByAccountHash(accountHash);
    // }
}
