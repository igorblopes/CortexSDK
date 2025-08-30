export interface IFingerprint {
    accountHash: string;
    ip: string;
    connectionType: string;
    screenResolution: string;
    locality: IUserLocality;
    device: string;
    timezone: string;
    language: string;
    operatingSystem: string;
    soVersion: string;
    deviceType: string;
    browserAgent: string;
    createdAt: string;
}

export interface IUserLocality {
    latitude: number;
    longitude: number;
}

export interface IUserBehavior {
  accountHash: string;
  pageVisit: string;
  clicks: IUserBehaviorClicks[];
  sessionDuration: number;
  createdAt: string;
}

export interface IUserBehaviorClicks {
    elementClick: string;
    createdAt: string;
}

export interface ICheckout {
  accountHash: string;
  itens: ICheckoutItens[];
  createdAt: Date;
}

export interface ICheckoutItens {
  typeItem: string;
  quantity: number;
  unitValue: number;
}

export interface IFraudAssessment {
  accountHash: string;
  score: number;
  level: string | undefined;
  reasons: string[];
  createdAt: Date;
}

/**
 * 
 * @remarks
 * Esta interface e o ponto de entrada da coleta de dados. Contendo o tipo de dados a ser ingerido e os dados propriamente dito.
 * 
 */
export interface IIntakeData {

  /**
   * Tipo de dados que sera ingerido.
   * 
   * @example
   * //Dados de comportamento do usuario.
   * "IntakeUserBehavior"
   * 
   * @example
   * //Dados de Fingerprint do usuario.
   * "IntakeLogin"
   * 
   * @example
   * // Dados de checkout da compra de usuario.
   * "IntakeCheckout"
   */
  typeData: string;

  /**
   * 
   * Dados referente a coleta para futuras verificacoes de fraude. <br>
   * Aceitas os seguintes dados: <br>
   *  Quando typeData = "IntakeUserBehavior" {@link IUserBehavior}. <br>
   *  Quando typeData = "IntakeLogin" {@link ICheckout}. <br>
   *  Quando typeData = "IntakeCheckout" {@link IFingerprint}.
   * 
   */
  data: IUserBehavior | ICheckout | IFingerprint | any;
}