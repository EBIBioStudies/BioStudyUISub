import angular from 'angular'
import 'angular-cookies'

import LocalStorage from './localStorage.service'

export default angular.module('BioStudyApp.LocalStorage', ['ngCookies'])
    .service('LocalStorage', LocalStorage);
