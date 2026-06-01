import { ValueObject } from '../../../shared/domain/value-object';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export declare class Priority extends ValueObject<PriorityLevel> {
    private constructor();
    static low(): Priority;
    static medium(): Priority;
    static high(): Priority;
    static critical(): Priority;
    static fromString(level: string): Priority;
    get value(): PriorityLevel;
    getNumericValue(): number;
}
