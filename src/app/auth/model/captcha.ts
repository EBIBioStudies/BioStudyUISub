export class Captcha {
    constructor(public value: string = null) {
    };

    hasValue(): boolean {
        return this.value !== null;
    }

    reset(): void {
        this.value =  null;
    }
}