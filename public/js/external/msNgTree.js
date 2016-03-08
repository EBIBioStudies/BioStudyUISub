/*

 This code is bassed on some original compoenent angular.treeview from
 ⓒ http://github.com/eu81273/angular.treeview
 License: MIT


 [TREE attribute]
 angular-treeview: the treeview directive
 tree-id : each tree's unique id.
 tree-model : the tree model on $scope.
 node-id : each node's id
 node-label : each node's label
 node-children: each node's children

 <ms-ng-tree
 data-angular-treeview="true"
 data-tree-id="tree"
 data-tree-model="roleList"
 data-node-id="roleId"
 data-node-label="roleName"
 data-node-children="children" >
 </ms-ng-ree>
 */

'use strict';

angular.module('msAngularUi', [])
    .directive('msNgTree',
    function ($compile) {

        return {
            restrict: 'E',
            //transclude : true,
            /*scope : {
             treeModel : '=',
             nodeLabel : "="
             },*/

            link: function (scope, element, attrs) {

                if (!scope['mytree']) {
                    scope['mytree']={};
                    scope['mytree'].onSelected=attrs.onSelected;

                }

                var attributes=getAttributes(attrs);
                var template = '<div>' +
                    '<ul>' +
                    '<li ng-repeat="node in ' +  attributes.treeModel+ '">' +
                    //'<li ng-repeat="node in treeModel">' +
                    '<span class="node.selected">'+
                    '<i class="'+attributes.expandedClass+'" data-ng-show="isExpanded(node);" data-ng-click="selectNodeHead(node);"></i>' +
                    '<i class="'+attributes.collapsedClass+'" data-ng-show="isCollapsed(node);" data-ng-click="selectNodeHead(node);"></i>' +
                    '<i class="'+attributes.itemClass+'" data-ng-show="node.type==\'FILE\'" data-ng-click="selectNodeHead(node);"></i>' +
                    '<span data-ng-class="node.selected" data-ng-dblclick="chooseNode(node);" data-ng-click="selectNodeLabel(node);"> {{node.' + attributes.nodeLabel + '}}</span>' +
                    '</span>' +
                    '<ms-ng-tree data-ng-hide="isCollapsed(node)" data-tree-model="node.' + attributes.nodeChildren + '" data-node-id=' + attributes.nodeId + ' data-node-label=' + attributes.nodeLabel + ' data-node-children=' + attributes.nodeChildren + '></ms-ng-tree>' +
                    '<li>' +
                    '</ul></div>';

                scope.selectNodeHead = function(node) {
                    console.log('Select node head');
                    node.expanded=!node.expanded;
                    if (node.type=='FILE') {
                        scope.selectNodeLabel(node);
                    }
                }

                scope.chooseNode = function(selectedNode) {
                    console.log('chooseNode');
                    //set currentNode
                    if (scope[scope['mytree'].onSelected] && angular.isFunction(scope[scope['mytree'].onSelected])) {
                        scope[scope['mytree'].onSelected](selectedNode);
                    }

                }

                scope.selectNodeLabel = function(selectedNode) {
                    if (!attributes.folderSelectable && selectedNode.type=='DIR') {
                        scope.selectNodeHead(selectedNode);
                        return;
                    }
                    console.log('selectNodeLabel',scope['mytree'].currentNode);


                    if( scope['mytree'].currentNode && scope['mytree'].currentNode.selected ) {
                        scope['mytree'].currentNode.selected = undefined;
                    }

                    //set highlight to selected node
                    selectedNode.selected = 'selected';
                    scope['mytree'].currentNode=selectedNode;
                    scope['mytree'].currentNode.selected=selectedNode.selected;


                }

                scope.isCollapsed = function(node) {
                    if (node.type!='DIR') {
                        return false;
                    }
                    var children = 0;

                    if (node[attributes.nodeChildren] && node[attributes.nodeChildren].length) {
                        var children = node[attributes.nodeChildren].length;
                    }
                    return (children && !node.expanded) || !children;

                }

                scope.isExpanded = function(node) {
                    if (node.type=='DIR' && node.expanded && node[attributes.nodeChildren].length) {
                        return true;
                    }
                }


                element.html('').append($compile(template)(scope));

            },
            controller: ['$scope', function( scope ) {

            }]

        };


        function getAttributes(obj) {
            var attributes={};
            attributes.onSelected=obj.onSelected;
            attributes.treeId=obj.treeId;
            attributes.nodeId = obj.nodeId || 'id';
            attributes.nodeLabel = obj.nodeLabel || 'label';
            attributes.treeModel = obj.treeModel || 'treeModel';
            attributes.nodeChildren = obj.nodeChildren || 'children';
            console.log(attributes.nodeChildren);
            attributes.folderSelectable=obj.folderSelectable || false;

            attributes.collapsedClass="collapsed fa fa-folder-o";
            attributes.expandedClass="expanded fa fa-folder-open-o";
            attributes.itemClass="normal fa fa-file-o";
            attributes.folderClass="normal fa fa-folder";
            return attributes;

        };



    });
