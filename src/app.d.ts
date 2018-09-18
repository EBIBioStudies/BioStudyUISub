interface StringConstructor {
    isDefined(s: string | undefined | null): boolean;

    isNotDefinedOrEmpty(s: string | undefined | null): boolean;

    isDefinedAndNotEmpty(s: string | undefined | null): boolean;
}
