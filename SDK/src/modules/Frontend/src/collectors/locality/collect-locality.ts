import { IUserLocality } from "../../../../Backend/src/interfaces";

export class CollectLocality {

    
    constructor(){

    }
   

    async getLocality(): Promise<IUserLocality>{

        return await new Promise<IUserLocality>((resolve, reject) => {
            fetch('https://ipapi.co/json/')
                .then(ipapi => {

                    ipapi.json()
                        .then((apiResponse) => {
                            let response: IUserLocality = {
                                latitude: apiResponse.latitude,
                                longitude: apiResponse.longitude 
                            };

                            resolve(response);


                        })
                        .catch((err) => reject(err))

                    
                })
                .catch((err) => reject(err))

        });
    }
    
}