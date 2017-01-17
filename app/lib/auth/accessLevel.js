export default class AccessLevelDirective {
    constructor(AccessLevel) {
        'ngInject';

        this.restrict = 'A';
        this.AccessLevel = AccessLevel;
    }

    link($scope, element, attrs) {
        var display = element.css('display');

        $scope.$watch($scope.currentUser,
            function () {
                updateCSS();
            }, true);

        function updateCSS() {
            if (!$scope.isAuthorized(this.AccessLevel.roles(attrs.accessLevel))) {
                element.css('display', 'none');
            }
            else {
                element.css('display', display);
            }
        }
    }
}