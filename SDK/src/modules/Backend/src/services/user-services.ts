import { UserBehaviorDB } from "../infra/database/cortext-db-user-behavior";
import { IIntakeData, IUpdateUserBehaviorScore, IUserBehavior } from "../interfaces";
import { ConfigModelDB } from "../interfaces-db";

export class UserServices {

    constructor(private userBehaviorServiceDB: UserBehaviorDB){}

    
    async createUserBehavior(request: IIntakeData): Promise<void> {
        let entity: IUserBehavior = {
            accountHash: request.data.accountHash,
            clicks: request.data.clicks,
            pageVisit: request.data.pageVisit,
            sessionDuration: request.data.sessionDuration,
            createdAt: request.data.createdAt
        };

        return await this.userBehaviorServiceDB.createUserBehaviorEntity(entity)
    }

    async getAllUserBehaviorScore(): Promise<ConfigModelDB[]> {
        return await this.userBehaviorServiceDB.allUserBehaviorScore();
    }

    async updateUserBehaviorScore(request: IUpdateUserBehaviorScore): Promise<ConfigModelDB> {
        return await this.userBehaviorServiceDB.updateUserBehaviorScore(request);
    }
}