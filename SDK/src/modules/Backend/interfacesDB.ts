export interface FingerprintModelDB {
    id: string;
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
    created_at: string;
}

export interface CheckoutModelDB {
    id: string;
    account_hash: string;
    type: string;
    quantity: number;
    unit_value: number;
    created_at: Date;
}