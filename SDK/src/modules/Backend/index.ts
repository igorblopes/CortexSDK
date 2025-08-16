import { CortexDatabase } from './infra/database/cortex-db';
import { RootDatabase } from './infra/database/root-db';
//import { FraudAssessment } from './interfaces';
//import { FraudServices } from './services/fraud-services';
import { SenseServices } from './services/sense-services';


export class BackendSDK {
    rootDB = new RootDatabase();
    db = new CortexDatabase(this.rootDB);

    init() {
        this.db.init();
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
    getAllSenseScores(): any{
        let senseService = new SenseServices(this.db.senseScoreDB);
        let done = false;
        let result: any[] = [];

        senseService.getAllSenseScore().then((res) => {
            result = res;
            done = true;
        }).catch((err) => {
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