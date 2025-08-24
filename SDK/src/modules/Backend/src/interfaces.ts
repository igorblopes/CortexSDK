export interface Fingerprint {
    accountHash: string;
    ip: string;
    connectionType: string;
    screenResolution: string;
    locality: UserLocality;
    device: string;
    timezone: string;
    language: string;
    operatingSystem: string;
    soVersion: string;
    deviceType: string;
    browserAgent: string;
    createdAt: string;
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
  createdAt: string;
}

export interface UserBehaviorClicks {
    elementClick: string;
    createdAt: string;
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