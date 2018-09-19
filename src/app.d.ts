interface StringConstructor {
    isDefined(s: string | undefined | null): boolean;

    isNotDefinedOrEmpty(s: string | undefined | null): boolean;

    isDefinedAndNotEmpty(s: string | undefined | null): boolean;
}

type AnyString = string | null | undefined

type Dictionary<T> = { [key: string]: T | undefined }