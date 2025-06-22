import * as sqlite3 from 'sqlite3';
import { Fingerprint, UserLocality } from '../../interfaces';
import { ConfigModelDB, FingerprintModelDB } from '../../interfaces-db';

export class FingerprintDB {

    constructor(private db: sqlite3.Database){}


    async createTableFingerprintScore() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS fingerprint_score ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT, 
                score INTEGER, 
                status INTEGER)
            `);            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    
    async findAllFingerprintScore(): Promise<ConfigModelDB[]> {
        let all: ConfigModelDB[] = [];
        
        try {

            await this.db.all<ConfigModelDB>(`
                SELECT * FROM fingerprint_score
            `, function(err, rows) {

                if (err) {
                    console.error('Erro ao Buscar:', err.message);
                    return;
                }

                for(let row of rows) {
                    all.push({
                        id: row.id,
                        name: row.name,
                        score: row.score,
                        status: row.status
                    });
                }

            });            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }

        return all;
    }
    
    async seedFingerprintScore() {

        try {
            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new locality", 90, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new locality");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new device", 20, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new device");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new ip", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new ip");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new language", 5, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new language");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new timezone", 5, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new timezone");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its different wifi connection", -10, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its different wifi connection");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new screen resolution", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new screen resolution");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new system operation", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new system operation");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new so version", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new so version");
            `);

            await this.db.run(`
                INSERT INTO fingerprint_score (name, score, status)
                SELECT "Its new browser agent", 10, 1
                WHERE NOT EXISTS(SELECT 1 FROM fingerprint_score WHERE name = "Its new browser agent");
            `);
            
        } catch (err) {
            console.error('Error creating seed fingerprint_score:', err);
        }
    }

    async createTableFingerprint() {
        try {
            await this.db.run(`CREATE TABLE IF NOT EXISTS fingerprint ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_hash TEXT,
                ip TEXT,
                connection_type TEXT,
                screen_resolution TEXT,
                locality TEXT,
                device TEXT,
                timezone TEXT,
                language TEXT,
                operating_system TEXT,
                so_version TEXT,
                device_type TEXT,
                browser_agent TEXT,
                created_at TEXT)
            `);     
            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }
    


    async createFingerprintEntity(fingerprint: Fingerprint) {
        try {
            let locality = fingerprint.locality != null ? `${fingerprint.locality.lat} , ${fingerprint.locality.long}` : "";
            let screenResolution = `${fingerprint.screenResolution[0]} , ${fingerprint.screenResolution[1]}`;
            await this.db.run(`
                INSERT INTO fingerprint (account_hash, ip, connection_type, screen_resolution, locality, device, timezone, language, operating_system, so_version, device_type, browser_agent, created_at)
                VALUES (
                    ${fingerprint.accountHash}, 
                    ${fingerprint.ip},
                    ${fingerprint.connectionType},
                    ${screenResolution},
                    ${locality},
                    ${fingerprint.device},
                    ${fingerprint.timezone},
                    ${fingerprint.language},
                    ${fingerprint.operatingSystem},
                    ${fingerprint.soVersion},
                    ${fingerprint.deviceType},
                    ${fingerprint.browserAgent},
                    ${fingerprint.createdAt}
                )
            `);

            
        } catch (err) {
            console.error('Error creating database or table:', err);
        }
    }

    async findFingerprintsByAccountHash(accountHash: string): Promise<Fingerprint[]> {

        let fingerprints: Fingerprint[] = [];
        let context = this;

        await this.db.all<FingerprintModelDB>(`
           SELECT * FROM fingerprint WHERE account_hash = ${accountHash}
        `, function(err, rows) {

            if (err) {
                console.error('Erro ao Buscar:', err.message);
                return;
            }
            
            for(let item of rows){
                if(item != null){
                    fingerprints.push(
                        context.convertItemDatabaseToModel(item)
                    )
                }
            }

        });

        fingerprints.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        return fingerprints;

    }

    convertItemDatabaseToModel(item: FingerprintModelDB): Fingerprint{

        let localityArray = item.locality.split(",");
        let locality: UserLocality = {
            lat: Number(localityArray[0]),
            long: Number(localityArray[1])
        };

        let dateCreatedAt = new Date(item.created_at);

        let screenResolutionArray = item.screen_resolution.split(",");
        let screenResolution = [Number(screenResolutionArray[0]), Number(screenResolutionArray[1])];


        let fingerprint: Fingerprint = {
            accountHash: item.account_hash,
            ip: item.ip,
            connectionType: item.connection_type,
            screenResolution: screenResolution,
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