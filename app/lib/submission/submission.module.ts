import {NgModule}  from '@angular/core';
import {HttpClientModule} from '../http/http-client.module';

import {SubmissionService} from './submission.service';
import {DictionaryService} from './dictionary.service';
import {SubmissionModel} from './submission.model';
import {PubMedSearchService} from './pubMedSearch.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        SubmissionService,
        PubMedSearchService,
        DictionaryService,
        SubmissionModel
    ],
    declarations: [
    ],
})
export class SubmissionModule {
}