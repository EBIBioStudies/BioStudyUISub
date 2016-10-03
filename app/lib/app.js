import angular from 'angular';
import { upgradeAdapter } from './upgrade_adapter.ts';

angular.element(document).ready(function() {
    upgradeAdapter.bootstrap(document.body, ['BioStudyApp']);
});