'use strict';

module.exports = ['$compile', '$templateRequest',
    function ($compile, $templateRequest) {
        return {
            restrict: 'EA',
            link: function (scope, elem, attrs) {
                var templateUrl = attrs.src;
                $templateRequest(templateUrl).then(function (data) {
                    elem.replaceWith(data);
                });
            }
        };
    }
];