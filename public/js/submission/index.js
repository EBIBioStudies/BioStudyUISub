'use strict';

(function () {

    var app = angular.module('BioStudyApp');

    app
        .factory('SubmissionService', require('./submission.service'))
        .service('DictionaryService', require('./dictionary.service'))
        .controller('SubmissionListCtrl', require('./views/submissionList.ctrl'))
        .controller('EditSubmissionCtrl', require('./views/editSubmission.ctrl'))
        .controller('PublicationCtrl', require('./views/publication.ctrl'))
        .controller('FileCtrl', require('./views/file.ctrl'))
        .directive('bsSectionItem', require('./directives/bsSectionItem'))
        .factory('SubmissionModel', require('./model/submission.model'));


    require('./directives/bsSection')(app);

})();

