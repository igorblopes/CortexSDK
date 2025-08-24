import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { UserBehavior } from "../interfaces";

export class UserServices {

    constructor(private userBehaviorDB: UserBehaviorDB){}

    
    async createUserBehavior(request: any): Promise<void> {
        let entity: UserBehavior = {
            accountHash: request.data.accountHash,
            clicks: request.data.clicks,
            pageVisit: request.data.pageVisit,
            sessionDuration: request.data.sessionDuration,
            createdAt: request.data.createdAt
        };

        return await this.userBehaviorDB.createUserBehaviorEntity(entity)
    }


}