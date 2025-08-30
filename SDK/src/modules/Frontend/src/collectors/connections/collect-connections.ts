export class CollectConnections {

    
    constructor(){

    }
   

    getConnectionType(): any{
        const navigatorWithConn = navigator as NavigatorConnection;
        const connection = navigatorWithConn.connection;
        

        let connectionType = "";
        if(connection?.type){
            connectionType += connection.type;
        }

        if(connection?.effectiveType){
            connectionType += " - "+connection?.effectiveType;
        }

        if(!connectionType) {
            return "Tipo de conexão não encontrado.";
        }

        return connectionType;
        
    }
    
}

interface NavigatorConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

interface NetworkInformation extends EventTarget {
  downlink: number; // Mbps estimados
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  rtt: number;      // Latência em ms
  saveData: boolean;
  type?: "bluetooth" | "cellular" | "ethernet" | "none" | "wifi" | "wimax" | "other" | "unknown";
  addEventListener(
    type: "change",
    listener: (this: NetworkInformation, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
}