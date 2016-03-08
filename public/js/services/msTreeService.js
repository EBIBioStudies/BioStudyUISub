'use strict';

module.exports=function() {
    var selectedElement = {};
    var msTreeService = {};
    msTreeService.select = function (element, id) {
        console.log(id);

        if (selectedElement[id]) {
            selectedElement[id].removeClass('selected');
        }
        selectedElement[id] = element;
        selectedElement[id].addClass('selected');
    };
    return msTreeService;
};