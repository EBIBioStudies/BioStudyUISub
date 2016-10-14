export class RegistrationData {
    constructor(
        public username: string = '',
        public password: string = '',
        public email: string = '',
        public orcid: string = '',
        public captcha: string = ''
    ) {}

    private static transform(obj) {
        var res = {};
        for (var n of ['username', 'email', 'password']) {
            res[n] = obj[n] || '';
        }
        res['aux'] = ['orcid:' + (obj.orcid || '')];
        res['recaptcha2-response'] = obj.captcha;
        return res;
    }

}