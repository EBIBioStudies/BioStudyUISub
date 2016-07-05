'use strict';

module.exports = ['PUBMEDID_SEARCH_EVENTS', function (PUBMEDID_SEARCH_EVENTS) {
    return {
        restrict: 'E',
        scope: {
            pmid: "=ngModel",
            readOnly: "=ngReadonly"
        },
        template: function (elem, attrs) {
            return '<input type="text" name="_pmid_search_" placeholder="Enter Pub Med Id" ng-model="pmid" ng-readonly="readOnly" class="' + attrs.childClass + '">';
        },
        controller: function($scope, $log, $timeout, PubMedSearch) {
            var timeout = null;

            function pubMedSearch() {
                PubMedSearch.search($scope.pmid).then(
                    function(resp) {
                        $log.debug(resp);
                        if (resp.status === "OK" && resp.data.hasOwnProperty('title')) {
                            $scope.$emit(PUBMEDID_SEARCH_EVENTS.pubMedIdFound, uppercaseProperties(resp.data));
                        }
                    }
                )
            }

            function uppercaseProperties(obj) {
                var res = {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        res[key.charAt(0).toUpperCase() + key.substring(1)] = obj[key];
                    }
                }
                return res;
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