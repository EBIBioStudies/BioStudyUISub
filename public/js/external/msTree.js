module.exports = function () {
    return {
            template: '<ms-tree-node ng-repeat="node in tree"></ms-tree-node>',
            replace: true,
            transclude: true,
            restrict: 'EA',
            scope: {
                tree: '=ngModel',
                folderType:"=",
                fileType:"=",
                hovering: "=",//branch, leaf
                classExpanded:  "@",
                classCollapsed:  "@",
                classFile: "@",
                classParent: "@",
                classLeaf: "@",
                select : "&onSelect"
            }
        };
};

