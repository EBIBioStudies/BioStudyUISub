interface StringConstructor {
    isDefined(s: string | undefined | null): boolean;

    isNotDefinedOrEmpty(s: string | undefined | null): boolean;

    isDefinedAndNotEmpty(s: string | undefined | null): boolean;

    isEqualIgnoringCase(value: string): boolean;
}

interface Array<T> {
    isEmpty(): boolean;

    uniqueValues(): Array<T>;

    flatMap<U>(mapFunc: (x: T) => U[]): Array<U>;
}

type AnyString = string | null | undefined

type Dictionary<T> = { [key: string]: T | undefined }