import angular from 'angular'

import ORCIDInputBoxDirective from './orcidInputBox'
import './orcidInputBox.less!'

export default angular.module('BioStudyApp.ORCID', [])
    .directive('orcidInputBox', ORCIDInputBoxDirective)