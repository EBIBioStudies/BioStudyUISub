import {Submission} from './submission.model';
import {Observable} from 'rxjs/Observable';

export class SubmissionValidator {

    constructor(private subm: Submission) {
    }

    validate(): any[] {
        return [];
    }

    cancel(): void {
    }

    asObservable(): Observable<any[]> {
        return Observable.create(function (observer) {
            observer.onNext(this.validate());
            observer.onCompleted();

            return function () {
                this.cancel();
            };
        });
    }
}
