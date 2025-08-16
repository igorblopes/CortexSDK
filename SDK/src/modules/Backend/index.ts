import { CortexDatabase } from './infra/database/cortex-db';
import { RootDatabase } from './infra/database/root-db';
import { FraudAssessment } from './interfaces';
import { SenseScoreModelDB } from './interfaces-db';
import { FraudServices } from './services/fraud-services';
import { SenseServices } from './services/sense-services';


export class BackendSDK {
    rootDB = new RootDatabase();
    db = new CortexDatabase(this.rootDB);

    init() {
        console.log("Backend SDK iniciando...");
        
        this.db.init();

        console.log("Backend SDK iniciado!");
    }

    test(): any {
        return {
            "Teste": "teste"
        };
    }

    async getAllSenseScores(): Promise<SenseScoreModelDB[]>{
        let senseService = new SenseServices(this.db.senseScoreDB);
        return await senseService.getAllSenseScore();
    }

     async getLevelByScore(score: string): Promise<string> {
        let senseService = new SenseServices(this.db.senseScoreDB);
        return await senseService.getLevelByScore(score);
     }

    async getFraudByAccountHash(accountHash: string): Promise<FraudAssessment[]> {
        let fraudService = new FraudServices(this.db.fraudDB);
        return await fraudService.findFraudByAccountHash(accountHash);
    }

    
    
}