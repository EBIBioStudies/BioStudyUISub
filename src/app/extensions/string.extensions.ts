String.prototype.isEqualIgnoringCase = function (value: string) {
    return this.toLowerCase() === value.toLowerCase();
};

String.prototype.isEmpty = function () {
    return this.trim().length > 0;
};

String.isDefined = function (s: string | undefined | null) {
    return s !== undefined && s !== null;
};

String.isNotDefinedOrEmpty = function (s: string | undefined | null) {
    return !String.isDefinedAndNotEmpty(s)
};

String.isDefinedAndNotEmpty = function (s: string | undefined | null) {
    return String.isDefined(s) && !s!.isEmpty()
};