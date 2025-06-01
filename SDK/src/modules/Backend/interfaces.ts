export interface Fingerprint {
    accountHash: string;
    ip: string;
    conectionType: string;
    screenResolution: [number, number];
    locality: UserLocality;
    device: string;
    timezone: string;
    language: string;
    operatingSystem: string;
    soversion: string;
    deviceType: string;
    createdAt: Date;
}

export interface UserLocality {
    lat: number;
    long: number;
}

export interface UserBehavior {
  pageVisit: string;
  clicks: UserBehaviorClicks[];
  sessionDuration: number;
  createdAt: Date;
}

export interface UserBehaviorClicks {
    elementClick: string;
    createdAt: string;
}

export interface FraudAssessment {
  score: number;
  level: 'allow' | 'review' | 'deny';
  reasons: string[];
  createdAt: Date;
}