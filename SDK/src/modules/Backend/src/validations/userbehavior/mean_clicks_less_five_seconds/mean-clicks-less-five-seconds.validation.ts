import { IUserBehavior } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class MeanClicksLessFiveSeconds implements Validation{


    validation(itens: IUserBehavior[], score: number): number {
        //TODO: Implement Verification


        if(itens.length > 0) return 0;
        if(score > 1000) return 0;
        return 0;
    }

    

}