import {AppPath} from './app-path';

export class DataSnapshot {
    constructor(private snapshot: any = {}){};
    add(name: string, value: string): DataSnapshot {
        let copy = {...this.snapshot};
        copy[name] = value;
        return new DataSnapshot(copy);
    }
}

export class DataWithCaptcha {
    captcha: string = '';

    valid(): boolean {
        return this.captcha.trim().length > 0;
    }

    resetCaptcha(): void {
        this.captcha = '';
    }

    snapshot(): DataSnapshot {
        return new DataSnapshot().add('captcha', this.captcha);
    }
}

export class DataWithCaptchaAndPath extends DataWithCaptcha {
    private _path: AppPath;

    constructor(path: AppPath) {
        super();
        this._path = path;
    }

    get path(): string {
        return this._path.value;
    }

    snapshot(): any {
        return super.snapshot().add('path', this.path);
    }
}