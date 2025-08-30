import { IUserLocality } from "../../../../Backend/src/interfaces";

export class CollectLocality {

    
    constructor(){

    }
   

    getLocality(): IUserLocality{

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    return {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log("Latitude:", position.coords.latitude);
                    console.log("Longitude:", position.coords.longitude);
                }
            );
        } 

        return {
            latitude: 0,
            longitude: 0
        };


        let locality: IUserLocality = {
            latitude: 123,
            longitude: -123
        };

        return locality;
    }
    
}