'use strict';

angular.module('BioStudyApp')

    .factory('SubmissionService', require('./submission.service'))
    .service('EditSubmissionService', require('./editSubmission.service'))
    .service('submissionDecorator',require('./views/submissionDecorator'))
    .controller('SubmissionListCtrl', require('./views/submissionList.ctrl'))
    .controller('EditSubmissionCtrl', require('./views/editSubmission.ctrl'))
    .controller('PublicationCtrl', require('./views/publication.ctrl'))
    .controller('FileCtrl', require('./views/file.ctrl'));
