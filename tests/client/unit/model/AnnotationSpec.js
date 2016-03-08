'use strict';


require('./moduleHelper');
var annotationArray1=[{key:'key1',value:'value1'},
                     {key:'key2',value:'value2'}
                    ];
var annotationArray2=[{key:'key1',value:'value1'},
    {}
];

describe('Test model Annotation', function() {

    beforeEach(function () {

        angular.mock.module('app');
    });
    it('should create an instance of Annotation', angular.mock.inject( function (Annotation) {
        var ann = new Annotation('key1','value1');
        expect(ann).toBeDefined();
        expect(ann.key).toEqual('key1');
        expect(ann.value).toEqual('value1');

        ann = new Annotation();
        expect(ann).toBeDefined();
        expect(ann.key).toEqual('');
        expect(ann.value).toEqual('');

    }));

    it('should create an instance of Annotation using build', angular.mock.inject( function (Annotation) {
        var ann = Annotation.build('key1','value1');
        expect(ann).toBeDefined();
        expect(ann.key).toEqual('key1');
        expect(ann.value).toEqual('value1');
        //create empty annotation;
        //ann=Annotation.build('','');
        //expect(ann).toBeDefined();

    }));

    it('should create array of Annotations using buildArray', angular.mock.inject( function (Annotation) {
        var ann = Annotation.buildArray(annotationArray1);
        expect(ann).toBeDefined();
        expect(ann.length).toEqual(2);

        ann = Annotation.buildArray(annotationArray2);
        expect(ann).toBeDefined();
        expect(ann.length).toEqual(1);

    }));


});
