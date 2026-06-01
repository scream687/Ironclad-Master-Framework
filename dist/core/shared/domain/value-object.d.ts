export declare abstract class ValueObject<T> {
    protected readonly props: T;
    constructor(props: T);
    equals(object?: ValueObject<T>): boolean;
    get value(): T;
}
