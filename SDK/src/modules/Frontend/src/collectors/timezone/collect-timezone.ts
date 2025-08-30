export class CollectTimezone {

    
    constructor(){

    }
   

    getTimezone(): any{
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    
}