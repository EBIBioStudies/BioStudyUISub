export class Credentials {
    constructor(
        public login: string,
        public password: string
    ) {}

    stringify() {
        return JSON.stringify({login: this.login, password: this.password});
    }
}