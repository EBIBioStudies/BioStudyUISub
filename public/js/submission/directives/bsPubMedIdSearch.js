'use strict';

module.exports = [function () {
    return {
        restrict: 'E',
        scope: {
            pmid: "=ngModel",
            callback: "&callback"
        },
        template: function (elem, attrs) {
            return '<input type="text" name="_pmid_search_" placeholder="Enter Pub Med Id" ng-model="pmid" class="' + attrs.childClass + '">';
        },
        controller: function($scope, $log, $timeout, PubMedSearch) {
            var timeout = null;

            function pubMedSearch() {
                PubMedSearch.search($scope.pmid).then(
                    function(resp) {
                        $log.debug(resp);
                        if (resp.status === "OK" && resp.data.hasOwnProperty('title')) {
                            $scope.callback(resp.data);
                        }
                    }
                )
            }
            
            function debounceSearch() {
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(pubMedSearch, 1000);
            }

            var unwatch = $scope.$watch('pmid', function (val) {
                if (val) {
                    debounceSearch();
                }
            });

            $scope.$on('$destroy', function () {
                $log.debug("bspPubMedIdSearch on-destroy");
                unwatch();
            });
        }
    };
}];