import angular from 'angular'

import TreeGridDirective from './directives/treeGrid'
import CompileDirective from './directives/compile'

export default angular.module('TreeGrid', [])
    .directive('treeGrid', TreeGridDirective)
    .directive('compile', CompileDirective)
    .filter('searchFor', function () {
        return function (arr, filterString, expandingProperty, colDefinitions) {
            var filtered = [];
            //only apply filter for strings 3 characters long or more
            if (!filterString || filterString.length < 3) {
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if (item.visible) {
                        filtered.push(item);
                    }
                }
            } else {
                var ancestorStack = [];
                var currentLevel = 0;
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    while (currentLevel >= item.level) {
                        throwAway = ancestorStack.pop();
                        currentLevel--;
                    }
                    ancestorStack.push(item);
                    currentLevel = item.level;
                    if (include(item, filterString, expandingProperty, colDefinitions)) {
                        for (var ancestorIndex = 0; ancestorIndex < ancestorStack.length; ancestorIndex++) {
                            ancestor = ancestorStack[ancestorIndex];
                            if (ancestor.visible) {
                                filtered.push(ancestor);
                            }
                        }
                        ancestorStack = [];
                    }
                }
            }
            return filtered;
        };

        function include(item, filterString, expandingProperty, colDefinitions) {
            var includeItem = false;
            var filterApplied = false;
            //first check the expandingProperty
            if (expandingProperty.filterable) {
                filterApplied = true;
                if (checkItem(item, filterString, expandingProperty)) {
                    includeItem = true;
                }
            }
            //then check each of the other columns
            var arraySize = colDefinitions.length;
            for (var i = 0; i < arraySize; i++) {
                var col = colDefinitions[i];
                if (col.filterable) {
                    filterApplied = true;
                    if (checkItem(item, filterString, col)) {
                        includeItem = true;
                    }
                }
            }
            if (filterApplied) {
                return includeItem;
            } else {
                return true;
            }
        }

        function checkItem(item, filterString, col) {
            if (col.sortingType === "number") {
                if (item.branch[col.field] != null
                    && parseFloat(item.branch[col.field]) === parseFloat(filterString)) {
                    return true;
                }
            } else {
                if (item.branch[col.field] != null
                    && item.branch[col.field].toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
                    return true;
                }
            }
        }
    });