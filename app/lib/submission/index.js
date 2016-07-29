import angular from 'angular'
import 'angular-messages'

import 'lodash'
//import uiRouter from 'angular-ui-router'
import uibTabs from 'angular-ui-bootstrap/src/tabs'
import uibTooltip from 'angular-ui-bootstrap/src/tooltip/index-nocss'

import uibTypeahead from 'angular-ui-bootstrap/src/typeahead/index-nocss'
import 'angular-ui-bootstrap/src/typeahead/typeahead.css!'

import uibDatepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss'
import 'angular-ui-bootstrap/src/datepickerPopup/popup.css!'

import 'trNgGrid'
import 'trNgGrid/trNgGrid.css!'

import appAuth from '../auth/index'
import appModals from '../modals/index'
import appFile from '../file/index'

import SubmService from './services/submission.service'
import DictService from './services/dictionary.service'
import PubMedSearchService from './services/pubMedSearch.service'
import SubmModel from './model/submission.model'

import SubmListCtrl from './pages/list/submissionList.ctrl'
import SubmEditCtrl from './pages/edit/submissionEdit.ctrl'
import SubmViewCtrl from './pages/edit/submissionView.ctrl'
import FileCtrl from './pages/edit/file.ctrl'

import BsNgItemDirective from './directives/bsNgItem'
import BsNgToggleDirective from './directives/bsNgToggle'
import BsPanelDirective from './directives/bsPanel'
import BsSectionDirective from './directives/bsSection'
import BsSectionItemDirective from './directives/bsSectionItem'
import BsReplaceDirective from './directives/bsReplace'
import BsPubMedIdSearchDirective from './directives/bsPubMedIdSearch'
import MsDuplicateDirective from './directives/msDuplicate'

export default angular.module('BioStudyApp.Submission',
    ['ngMessages', 'trNgGrid', uibTabs, uibTooltip, uibTypeahead, uibDatepickerPopup,
        appAuth.name, appModals.name, appFile.name])
    .constant('_', window._)
    .service('SubmissionService', SubmService)
    .service('DictionaryService', DictService)
    .service('PubMedSearch', PubMedSearchService)
    .service('SubmissionModel', SubmModel)
    .constant('PUBMEDID_SEARCH_EVENTS', {
        pubMedIdFound: 'pub-med-id-found'
    })
    .controller('SubmissionListCtrl', SubmListCtrl)
    .controller('SubmissionEditCtrl', SubmEditCtrl)
    .controller('SubmissionViewCtrl', SubmViewCtrl)
    .controller('FileCtrl', FileCtrl)
    .directive('bsNgItem', () => new BsNgItemDirective())
    .directive('bsNgToggle', () => new BsNgToggleDirective())
    .directive('bsPanel', BsPanelDirective)
    .directive('bsSection', BsSectionDirective)
    .directive('bsSectionItem', BsSectionItemDirective)
    .directive('bsReplace', BsReplaceDirective)
    .directive('bsPubMedIdSearch', BsPubMedIdSearchDirective)
    .directive('msDuplicate', MsDuplicateDirective)
    .filter('filterAttrs', function () {
        return function (fieldValueUnused, array, key) {
            var ret = [];
            for (var i in array) {
                if (array[i].name === key) {
                    ret.push(array[i]);
                    return ret;
                }
            }
            return ret;
        };
    })
    .filter("filterAttrsTypeahead", function (_) {
        "ngInject";
        return function (fieldValueUnused, array, existedKeys) {
            var typeahead = [];
            for (var i in array) {
                var index = _.findIndex(existedKeys, {name: array[i].name});
                if (index === -1) {
                    typeahead.push(array[i]);
                }
            }
            return typeahead;
        };
    })
    .filter("filterDifference", function (_) {
        "ngInject";
        return function (fieldValueUnused, array, existedAttrs) {
            return _.differenceBy(array, _.map(existedAttrs, 'name'));
        };
    });

