/**
 * Main module
 * @module main
 */

import angular from 'angular'
import ngCookies from 'angular-cookies'
import ngMessages from 'angular-messages'
import ngFileUpload from 'ng-file-upload'
import vcRecaptcha from 'angular-recaptcha'


import uiBootstrap from 'angular-bootstrap'
import uiBootstrapShowErrors from 'angular-bootstrap-show-errors'
import uiSelect from 'angular-ui-select'
import uiRouter from 'angular-ui-router'
import typeaheadFocus from 'typeahead-focus'

import trNgGrid from 'trNgGrid'

import lodash from 'lodash'

//import appTemplates from './templates'
import appConfig from './config'


const appName = 'BioStudyApp';

angular.module(appName,
    [
        ngCookies, ngMessages, ngFileUpload, vcRecaptcha, uiBootstrap, uiBootstrapShowErrors, uiSelect, uiRouter,
        typeaheadFocus, trNgGrid, lodash,

        appConfig, appTemplates
    ]);
