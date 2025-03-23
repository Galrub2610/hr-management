export enum CalculationType {
    HOURLY = 'HOURLY',
    DAILY = 'DAILY',
    MONTHLY = 'MONTHLY'
}

export interface Location {
    id: string;
    name: string;
    calculationType: CalculationType;
    // הוסף שדות נוספים לפי הצורך
} 