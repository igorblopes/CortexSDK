export class CollectDevice {

    
    constructor(){

    }
   

    getDevice(): any{
        const ua: string = navigator.userAgent;

        if (/android/i.test(ua)) return "Android";
        if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
        if (/windows phone/i.test(ua)) return "Windows Phone";
        if (/Macintosh/i.test(ua) && "ontouchend" in document) return "iPad (simulado)";

        if (/Windows NT/i.test(ua)) return "Windows PC";
        if (/Macintosh/i.test(ua)) return "Mac";
        if (/Linux/i.test(ua)) return "Linux";

        return "Desconhecido";
    }

    getDeviceType(): any{
        return navigator.platform;
    }

    getBrowserAgent(): any{
        return navigator.userAgent;
    }
    
}

interface Navigator {
  userAgentData?: NavigatorUAData;
}

interface NavigatorUAData {
  platform: string;
  mobile: boolean;
  brands: Array<{ brand: string; version: string }>;
}