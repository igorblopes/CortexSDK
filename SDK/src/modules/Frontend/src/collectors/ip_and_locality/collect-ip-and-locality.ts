export class CollectIp {

    
    constructor(){

    }
   

    async getIpAndLocality(): Promise<any> {

        return await new Promise<any>((resolve, reject) => {

            fetch("https://ipwho.is/")
                .then((resp) => {
                    resp.json()
                        .then((data) => resolve(data))
                        .catch(() => reject("IP nao encontrado."))
                })
                .catch((err) => reject("IP nao encontrado."));
        });

        
    }
    
}