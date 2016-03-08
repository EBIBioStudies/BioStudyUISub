'use strict';

module.exports=function() {
    return {
        template: '<tree-node-element ng-repeat="node in tree"></tree-node-element>',
        replace: true,
        transclude: true,
        restrict: 'EA',
        scope: {
            treeId: '=',
            tree: '=ngModel',
            folderType:'=',
            fileType:'=',
            hovering: '=',//branch, leaf
            classExpanded:  '@',
            classCollapsed:  '@',
            classFile: '@',
            classParent: '@',
            classLeaf: '@',
            select : '&onSelect',
            children : '='
        }
    };
};