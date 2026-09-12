export interface Experiment {
    instrument: string | null;
    timeframe: string | null;
    entryCondition: string | null;
    exitCondition: string | null;
    holdingPeriod: string | null;
    filters: string[];
    objective: string | null;
    missingInformation: string[];
    question: string;
}