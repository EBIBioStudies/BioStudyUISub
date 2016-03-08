/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

var routingConfig = require('../routeConfig');


module.exports = function ($http, $window, $location,
                           $rootScope, $log, $injector, SubmissionModel) {

    function deleteItem(parent, arrayName, index) {
        console.log('Delete from service',parent, index);
        if (parent && arrayName  && parent[arrayName]) {
            parent[arrayName].splice(index, 1);
            console.log('Delete from service 2');
        }

    }

    function addItem(parent, addMethodName, constructorFunc) {
        if (parent && addMethodName && constructorFunc) {
            var item = new constructorFunc();
            addMethodName(parent, item);
        }

    }




    var submissions = [];
    var submissionService = {};
    submissionService.submission=undefined;

    submissionService.deleteElement = function(index, array) {
        array.splice(index,1);
    };

    submissionService.showEditSubmission = function(sub) {
        submissionService.submission=sub;
    };

    submissionService.showAddSubmission = function() {
        submissionService.submission = undefined;
    };


    submissionService.addAnnotation = function(parent) {
        addItem(parent, SubmissionModel.addAttribute, SubmissionModel.createAttribute);
    };

    submissionService.deleteAnnotation = function(index, parent) {
        deleteItem(parent, 'annotations', index);
    };

    submissionService.addLink = function(parent, link) {
        addItem(parent,'addLink',link);
    };

    submissionService.deleteLink = function(index,parent) {
        deleteItem(parent, 'links', index);
    };

    submissionService.addSource = function(parent, source) {
        addItem(parent,'addSource',source);
    };

    submissionService.deleteSource = function(index, parent) {
        deleteItem(parent, 'sources', index);

    };

    submissionService.addAuthor = function(parent, author) {
        addItem(parent,'addAuthor',author);
    };

    submissionService.deleteAuthor = function(index,parent) {
        deleteItem(parent, 'authors', index);
    };

    submissionService.addSection = function(parent) {
        /*if (parent) {
            var section = new Section();
            section.name = 'Undefined';
            parent.addSection(section);
        }*/
    };

    submissionService.deleteSection = function(index, array) {
        console.log('delete section', index, array);
        array.splice(index, 1);
    };

    submissionService.deleteSubmission = function() {
        console.log('Delete data');
    };


    submissionService.addAttribute = function() {
        if (!this.attributes) {
            this.attributes = [];
        }
        this.attributes.push(SubmissionModel.createAttribute());
        console.log('Add attribute', this);
    };

    return submissionService;
};
