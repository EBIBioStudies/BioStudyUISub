interface String {
    isDefined(s: string | undefined | null): boolean;

    isNotDefinedOrEmpty(s: string | undefined | null): boolean;

    isDefinedAndNotEmpty(s: string | undefined | null): boolean;

    isEqualIgnoringCase(value: string): boolean;
}

String.prototype.isDefined = function (s: string | undefined | null) {
    return s !== undefined && s !== null;
};

String.prototype.isNotDefinedOrEmpty = function (s: string | undefined | null) {
    return !String.isDefinedAndNotEmpty(s)
};

String.prototype.isDefinedAndNotEmpty = function (s: string | undefined | null) {
    return String.isDefined(s) && s!.trim().length > 0;
};

String.prototype.isEqualIgnoringCase = function (value: string) {
    return this.toLowerCase() === value.toLowerCase();
};