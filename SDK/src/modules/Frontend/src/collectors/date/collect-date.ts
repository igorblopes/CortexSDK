export class CollectDate {

    
    constructor(){

    }
   

    getActualDate(): string {

        return this.formatBR(new Date(), "UTC");

        
    }

    formatBR(date: Date = new Date(), timeZone: string = "America/Sao_Paulo"): string {
        const f = new Intl.DateTimeFormat("pt-BR", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
        const base = f.format(date); // ex.: "04/09/2025 12:36:55"
        const ms = String(date.getMilliseconds()).padStart(3, "0");
        return `${base}:${ms}`;
    }
    
}