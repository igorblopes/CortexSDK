import * as sqlite3 from 'sqlite3';
import { IFingerprint, IUpdateFingerprintScore, IUserLocality } from '../../interfaces';
import { ConfigModelDB, FingerprintModelDB } from '../../interfaces-db';

export class FingerprintDB {

    constructor(private db: sqlite3.Database){}

   
    async findAllFingerprintScore(): Promise<ConfigModelDB[]> {

        return await new Promise<ConfigModelDB[]>((resolve, reject) => {

            let all: ConfigModelDB[] = [];

            this.db.all(
                `
                    SELECT * FROM fingerprint_score
                `
                ,(err: any, rows: any[]) => {

                    if (err) {
                        reject(err);
                    }

                    for(let row of rows) {
                        all.push({
                            id: row.id,
                            name: row.name,
                            score: row.score,
                            status: row.status
                        });
                    }

                    resolve(all);

                }
            );       

        });
        
    }


    async updateFingerprintScore(request: IUpdateFingerprintScore): Promise<ConfigModelDB> {

        return await new Promise<ConfigModelDB>((resolve, reject) => {

            let context = this;

            this.db.all(
                `
                    UPDATE fingerprint_score set score = '${request.score}', status = '${request.status}' WHERE id = '${request.id}'
                `
                ,function (err) {

                    if(err) reject(err);

                    context.getById(request.id)
                        .then((resp) => resolve(resp))
                        .catch((err) => reject(err))
                }
            );       

        });
    }

    
    async getById(id: any): Promise<ConfigModelDB> {
            return await new Promise<ConfigModelDB>((resolve, reject) => {
    
                this.findAllFingerprintScore()
                    .then((resp: ConfigModelDB[]) =>{
    
                        let out = resp.filter(f => f.id == id);
                        resolve(out[0]);
    
                    })
                    .catch((err) => reject(err))
            });
        }


    async createFingerprintEntity(fingerprint: IFingerprint): Promise<void> {

        return await new Promise<void>((resolve, reject) => {
            
            let locality = fingerprint.locality != null ? `${fingerprint.locality.latitude} , ${fingerprint.locality.longitude}` : "0x0";

            this.db.run(`
                INSERT INTO fingerprint (account_hash, ip, connection_type, screen_resolution, locality, device, timezone, language, operating_system, so_version, device_type, browser_agent, created_at)
                VALUES (
                    '${fingerprint.accountHash}', 
                    '${fingerprint.ip}',
                    '${fingerprint.connectionType}',
                    '${fingerprint.screenResolution}',
                    '${locality}',
                    '${fingerprint.device}',
                    '${fingerprint.timezone}',
                    '${fingerprint.language}',
                    '${fingerprint.operatingSystem}',
                    '${fingerprint.soVersion}',
                    '${fingerprint.deviceType}',
                    '${fingerprint.browserAgent}',
                    '${fingerprint.createdAt}'
                );

            
            `,(err: any) => {
                if(err) {
                    reject(err);
                }   
                resolve();
            });
        });
            
        
    }

    async findFingerprintsByAccountHash(accountHash: string): Promise<IFingerprint[]> {

        return await new Promise<IFingerprint[]>((resolve, reject) => {

            let fingerprints: IFingerprint[] = [];

            let context = this;

            this.db.all(
            `
                SELECT * FROM fingerprint WHERE account_hash = '${accountHash}'
            `
            ,(err: any, rows: any[]) => {

                if (err) {
                    reject(err);
                }

                if(!rows || rows.length == 0) {
                    resolve(fingerprints);
                }
                
                for(let item of rows){
                    if(item != null){
                        fingerprints.push(
                            context.convertItemDatabaseToModel(item)
                        )
                    }
                }

                //TODO: Validate sort with string
                //fingerprints.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

                resolve(fingerprints);

            });            

        });

    }

    convertItemDatabaseToModel(item: FingerprintModelDB): IFingerprint{

        let localityArray = item.locality.split(",");
        
        let locality: IUserLocality = {
            latitude: localityArray.length >= 2 ? Number(localityArray[0]) : 0,
            longitude: localityArray.length >= 2 ? Number(localityArray[1]) : 0
        };

        let dateCreatedAt = item.created_at;

        let fingerprint: IFingerprint = {
            accountHash: item.account_hash,
            ip: item.ip,
            connectionType: item.connection_type,
            screenResolution: item.screen_resolution,
            locality: locality,
            device: item.device,
            timezone: item.timezone,
            language: item.language,
            operatingSystem: item.operating_system,
            soVersion: item.so_version,
            deviceType: item.device_type,
            browserAgent: item.browser_agent,
            createdAt: dateCreatedAt
        };

        return fingerprint;
    }


}