import {Component, Inject} from '@angular/core';

import tmpl from './submissionList.component.html'

@Component({
    selector: 'submission-list',
    template: tmpl
})

export class SubmissionListComponent {
    public rows: Array<any> = [];
    public columns: Array<any> = [
        {title: 'Accession', name: 'accno', filtering: {filterString: '', placeholder: 'Filter by accession'}},
        {title: 'Title', name: 'position', sort: false, filtering: {filterString: '', placeholder: 'Filter by position'}},
        {title: 'Release Date', name: 'releaseDate', sort: 'asc'},
        {title: 'Status', name: 'ext', sort: '', filtering: {filterString: '', placeholder: 'Filter by extn.'}},
        {title: '', className: 'text-warning', name: 'startDate'},
    ];
    public page: number = 1;
    public itemsPerPage: number = 10;
    public maxSize: number = 5;
    public numPages: number = 1;
    public length: number = 0;

    public config: any = {
        paging: true,
        sorting: {columns: this.columns},
        filtering: {filterString: ''},
        className: ['table-striped', 'table-bordered']
    };

    constructor() {
    }

    createSubmission = function () {
        /*
         //TODO
         var sbm = SubmissionModel.create(Session.userName, Session.userEmail);
         SubmissionService.createSubmission(sbm)
         .then(function (sbm) {
         startEditing(sbm.accno);
         });
         */
    };
}