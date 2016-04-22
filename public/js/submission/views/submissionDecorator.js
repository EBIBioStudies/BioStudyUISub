var _keys = require('./../../../../shared/model/Structure.json');

module.exports = function ($anchorScroll) {
    this.create = function ($scope) {
        $scope.add = function (context, hash) {
            console.log('add', context);
            context.add();
        };

        $scope.addNew = function (context, hash) {
            console.log('add', context);
            context.add();
        };

        $scope.format = 'dd/MM/yyyy';
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.submModel = {};

        $scope.keys = _keys;


        $scope.addAnnotation = function (context) {
            context.add({});
        };

        $scope.viewModel = {
            links: {
                attributes: []
            }
        }

    }

};