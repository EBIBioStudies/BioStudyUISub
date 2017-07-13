export class PageTabEntry {
    readonly tags:any;

}


export class PageTabSubmission extends PageTabEntry {

    constructor(obj?: any) {

    }

}

export class PageTab {
    readonly submission: PageTabSubmission;

    constructor(obj?: any) {
        this.submission = new PageTabSubmission(obj);
    }
}