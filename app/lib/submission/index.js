import angular from 'angular'
import 'lodash'
//import uiRouter from 'angular-ui-router'
import 'trNgGrid'

import 'trNgGrid/trNgGrid.css!'

import appAuth from '../auth/index'
import appMisc from '../misc/index'

import SubmService from './services/submission.service'
import DictService from './services/dictionary.service'
//import PubMedSearchService from './services/pubMedSearch.service'
import SubmModel from './model/submission.model'

import SubmListCtrl from './pages/list/submissionList.ctrl'
//import SubmEditCtrl from './pages/edit/editSubmission.ctrl'
//import SubmViewCtrl from './pages/edit/viewSubmission.ctrl'
//import FileCtrl from './pages/edit/file.ctrl'

export default angular.module('BioStudyApp.Submission', ['trNgGrid', appAuth.name, appMisc.name])
    .constant('_', window._)
    .service('SubmissionService', SubmService)
    .service('DictionaryService', DictService)
    //.service('PubMedSearch', PubMedSearchService)
    .service('SubmissionModel', SubmModel)
    .constant('PUBMEDID_SEARCH_EVENTS', {
        pubMedIdFound: 'pub-med-id-found'
    })
    .controller('SubmissionListCtrl', SubmListCtrl);
   // .controller('EditSubmissionCtrl', SubmEditCtrl)
   // .controller('ViewSubmissionCtrl', SubmViewCtrl)
   // .controller('FileCtrl', FileCtrl);
    /*.directive('bsPanel', require('./directives/bsPanel'))
    .directive('bsSectionItem', require('./directives/bsSectionItem'))
    .directive('bsReplace', require('./directives/bsReplace'))
    .directive('bsPubMedIdSearch', require('./directives/bsPubMedIdSearch'));*/


//require('./directives/bsSection')(app);

