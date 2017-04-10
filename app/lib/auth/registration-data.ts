export class RegistrationData {
    constructor(
        public username: string = '',
        public password: string = '',
        public email: string = '',
        public orcid: string = '',
        public captcha: string = '',
        public path: string = ''
    ) {}
}