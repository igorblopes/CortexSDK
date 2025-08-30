export class CollectIp {

    
    constructor(){

    }
   

    async getIp(): Promise<any> {

        return await new Promise<any>((resolve, reject) => {

            fetch("https://api.ipify.org?format=json")
                .then((resp) => {
                    resp.json()
                        .then((data) => resolve(data.ip))
                        .catch(() => reject("IP nao encontrado."))
                })
                .catch((err) => reject("IP nao encontrado."));
        });

        
    }
    
}