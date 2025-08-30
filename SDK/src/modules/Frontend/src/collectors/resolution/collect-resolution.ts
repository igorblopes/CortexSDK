export class CollectScreenResolution {

    
    constructor(){

    }
   

    getScreenResolution(): string{
        return screen.width + "x" + screen.height;   
    }
    
}