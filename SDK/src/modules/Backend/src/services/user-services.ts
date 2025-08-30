import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { IIntakeData, IUserBehavior } from "../interfaces";

export class UserServices {

    constructor(private userBehaviorDB: UserBehaviorDB){}

    
    async createUserBehavior(request: IIntakeData): Promise<void> {
        let entity: IUserBehavior = {
            accountHash: request.data.accountHash,
            clicks: request.data.clicks,
            pageVisit: request.data.pageVisit,
            sessionDuration: request.data.sessionDuration,
            createdAt: request.data.createdAt
        };

        return await this.userBehaviorDB.createUserBehaviorEntity(entity)
    }


}