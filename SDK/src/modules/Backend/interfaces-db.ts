export interface FingerprintModelDB {
    id: number;
    account_hash: string;
    ip: string;
    connection_type: string;
    screen_resolution: string;
    locality: string;
    device: string;
    timezone: string;
    language: string;
    operating_system: string;
    so_version: string;
    device_type: string;
    browser_agent: string;
    created_at: string;
}

export interface CheckoutModelDB {
    id: number;
    account_hash: string;
    type: string;
    quantity: number;
    unit_value: number;
    created_at: string;
}

export interface FraudAssessmentModelDB {
    id: number;
    account_hash: string;
    score: number;
    level: 'allow' | 'review' | 'deny';
    created_at: string;
}

export interface FraudAssessmentReasonModelDB {
    id: number;
    reason: string;
    fraud_id: number;
}

export interface UserBehaviorModelDB {
    id: number;
    account_hash: string;
    page_visit: string;
    session_duration: number;
    created_at: string;
}

export interface UserBehaviorClicksModelDB {
    element_click: string;
    created_at: string;
}

export interface ConfigModelDB {
    id: number;
    name: string;
    score: number;
    status: number;
}

export interface SenseScoreModelDB {
    id: number;
    score: number;
    level: string;
}