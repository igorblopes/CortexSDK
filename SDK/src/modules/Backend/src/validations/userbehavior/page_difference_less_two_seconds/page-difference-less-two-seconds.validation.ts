import { IUserBehavior } from "../../../interfaces";
import { Validation } from "../../validation.interface";

export class PageDifferenceLessTwoSeconds implements Validation{


    validation(itens: IUserBehavior[], score: number): number {
        //TODO: Implement Verification

        if(itens.length > 0) return 100;
        return score;
    }

    

}