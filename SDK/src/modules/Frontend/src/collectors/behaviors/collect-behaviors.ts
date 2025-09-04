import { IUserBehavior, IUserBehaviorClicks } from "../../../../Backend/src/interfaces";

export class CollectUserBehaviors {


    private clicks: IUserBehaviorClicks[] = [];
    private serviceBase: any = null;
    private token: string = "";
    
    constructor(){

    }

    init(serviceBase: any, token: string, accountHash: string) {
        this.serviceBase = serviceBase;
        this.token = token;
        this.initializeChangePage(accountHash);
    }
   
    initializeChangePage(accountHash: string) {
        this.initializeClicks();

        const nav = (window as any).navigation;

        nav.addEventListener("navigate", (e: any) => {

          let response: IUserBehavior = {
            accountHash: accountHash,
            clicks: this.clicks,
            pageVisit: e.destination?.url,
            createdAt: new Date().toString(),
            sessionDuration: 0
          };

          let body = {
              "typeData": "IntakeUserBehavior",
              "data": response
          };

          this.makeIntakeDataRequest(body)
              .then(() => {
                
                this.clicks = [];
              
              });
        });

    }

    initializeClicks(): any{

      document.addEventListener("click", (event) => {

        const target = event.target as HTMLElement; 

        let click: IUserBehaviorClicks = {
          elementClick: target?.innerText,
          createdAt: new Date().toString()
        };
        this.clicks.push(click);
      });
               
    }


    async makeIntakeDataRequest(body: { typeData: string; data: any }) {
        return await new Promise<void>((resolve, reject) => {
            fetch(this.serviceBase + "/api/v1/intake/data", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.token
                },
                body: JSON.stringify(body),
            })
            .then(() => resolve())
            .catch((err) => reject(err));
        });
    }


    
    
}


interface Navigator {
  userAgentData?: NavigatorUAData;
}

interface NavigatorUAData {
  platform: string;
  mobile: boolean;
  brands: Array<{ brand: string; version: string }>;
}
