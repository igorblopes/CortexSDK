import { UserLocality } from "../../../Backend/src/interfaces";

export class CollectLocality {

    
    constructor(){

    }
   

    getLocality(): UserLocality{
        let locality: UserLocality = {
            lat: 123,
            long: -123
        };

        return locality;
    }
    
}