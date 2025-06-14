export interface Fingerprint {
    accountHash: string;
    ip: string;
    connectionType: string;
    screenResolution: number[];
    locality: UserLocality;
    device: string;
    timezone: string;
    language: string;
    operatingSystem: string;
    soVersion: string;
    deviceType: string;
    browserAgent: string;
    createdAt: Date;
}

export interface UserLocality {
    lat: number;
    long: number;
}

export interface UserBehavior {
  accountHash: string;
  pageVisit: string;
  clicks: UserBehaviorClicks[];
  sessionDuration: number;
  createdAt: Date;
}

export interface UserBehaviorClicks {
    elementClick: string;
    createdAt: Date;
}

export interface Checkout {
  accountHash: string;
  itens: CheckoutItens[];
  createdAt: Date;
}

export interface CheckoutItens {
  type: string;
  quantity: number;
  unitValue: number;
}

export interface FraudAssessment {
  accountHash: string;
  score: number;
  level: string | undefined;
  reasons: string[];
  createdAt: Date;
}