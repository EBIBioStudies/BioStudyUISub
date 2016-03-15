var _keys = require('./../../../../shared/model/Structure.json');

module.exports = function($anchorScroll) {
    this.create = function($scope) {
        $scope.add= function(context, hash) {
            context.add().then(function() {
                //$location.hash(hash);
                $anchorScroll(hash);
            });
        }

        $scope.format = 'dd/MM/yyyy';
        $scope.dateOptions= {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.submModel = {

        };

        $scope.keys = _keys;



    }

};