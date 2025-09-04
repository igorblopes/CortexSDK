export class CollectOperationSystem {

    
    constructor(){

    }
   

    getOperationSystem(browserAgent: string): any{
        const ua = browserAgent;

        if(ua.includes("Windows NT")) return "Windows";
        if(ua.includes("Mac OS X")) return "macOS";
        if(ua.includes("Linux")) return "Linux";
        if(ua.includes("Android")) return "Android";
        if(ua.includes("iPhone")) return "iOS";
        if(ua.includes("iPad")) return "iOS";
        if(ua.includes("iPod")) return "iOS";

        return "Desconhecido";
    }

    getOperationSystemVersion(): any{
        const ua = navigator.userAgent;

        // Windows
        if (/Windows NT 10\.0/.test(ua)) return "Windows 10 ou 11";
        if (/Windows NT 6\.3/.test(ua)) return "Windows 8.1";
        if (/Windows NT 6\.2/.test(ua)) return "Windows 8";
        if (/Windows NT 6\.1/.test(ua)) return "Windows 7";

        // macOS
        const mac = ua.match(/Mac OS X (\d+[_\.\d]+)/);
        if (mac) return "macOS " + mac[1].replace(/_/g, ".");

        // iOS
        const ios = ua.match(/OS (\d+[_\d]*) like Mac OS X/);
        if (ios) return "iOS " + ios[1].replace(/_/g, ".");

        // Android
        const android = ua.match(/Android\s+([\d\.]+)/);
        if (android) return "Android " + android[1];

        return "Versão desconhecida";
    }
    
}