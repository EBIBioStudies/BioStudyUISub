'use strict';

require('./moduleHelper');
var sectionArray=[
    {name:'name1', description: 'desc1'},
    {name:'name2', description: 'desc2'},

];

var sectionTemp={
    name : 'name1', description: 'desc',
        annotations: [{key:'key1',value:'value1'}],
        files:[{name:'key1',description:'value1'}],
        sections:[{name:'key1',description:'value1'}],
        links:[{url:'key1',description:'value1'}],
        authors:[{name:'key1',affiliation:'value1'}],
        sources:[{identifier:'key1',source:'value1'}]
};

describe('Test model Section', function() {

    beforeEach(function () {

        angular.mock.module('app');
    });
    it('should create an instance of Section. Constructor is called without parameters', angular.mock.inject( function (Section) {
        var section = new Section();
        expect(section).toBeDefined();
        expect(section.name).toEqual('');
    }));
    it('should create an instance of Section', angular.mock.inject( function (Section) {
        var section = new Section({name:'name1'});
        expect(section).toBeDefined();
        expect(section.name).toEqual('name1');
    }));

    it('should create an instance of Section with subsection', angular.mock.inject(
        function (Section, Annotation, Source, Link, Author, File) {

        var section = new Section(sectionTemp);
        expect(section).toBeDefined();
        expect(section.name).toEqual('name1');
        expect(section.description).toEqual('desc');
        expect(section.annotations).toBeDefined();
        expect(section.annotations.length).toEqual(1);
        expect(section.annotations[0]).toEqual(jasmine.any(Annotation));

    }));

    it('should create an instance of Section and add an Annotation', angular.mock.inject(
        function (Section, Annotation) {

            var section = new Section({});
            expect(section).toBeDefined();
            var ann = Annotation.build('key1','value1');
            section.addAnnotation(ann);
            expect(section.annotations).toBeDefined();
            expect(section.annotations).toEqual(jasmine.any(Array));
            expect(section.annotations.length).toEqual(1);
            expect(section.annotations[0]).toBe(ann);


        }));

    it('should create an instance of Section and delete an Annotation', angular.mock.inject(
        function (Section, Annotation) {

            var section = new Section({});
            expect(section).toBeDefined();
            var ann = Annotation.build('key1','value1');
            section.addAnnotation(ann);
            expect(section.annotations).toBeDefined();
            expect(section.annotations).toEqual(jasmine.any(Array));
            expect(section.annotations.length).toEqual(1);
            expect(section.annotations[0]).toBe(ann);
            //delete annotation
            section.deleteAnnotation(0);
            expect(section.annotations.length).toEqual(0);

        }));

    it('should create an instance of Section and add a File', angular.mock.inject(
        function (Section, File) {

            var section = new Section({});
            expect(section).toBeDefined();
            var obj = File.build('key1','value1');
            expect(obj).toBeDefined();
            section.addFile(obj);
            expect(section.files).toBeDefined();
            expect(section.files.length).toEqual(1);
            expect(section.files[0]).toEqual(jasmine.any(File));
            expect(section.files[0]).toBe(obj);
        }));

    it('should create an instance of Section and add a Link', angular.mock.inject(
        function (Section, Link) {

            var section = new Section({});
            expect(section).toBeDefined();
            var obj = Link.build('key1','value1');
            expect(obj).toBeDefined();
            section.addLink(obj);
            expect(section.links).toBeDefined();
            expect(section.links.length).toEqual(1);
            expect(section.links[0]).toEqual(jasmine.any(Link));
            expect(section.links[0]).toBe(obj);


        }));

    it('should create an instance of Section using build',
        angular.mock.inject( function (Section) {
            var section = Section.build({name:'name1'});
            expect(section).toBeDefined();
            expect(section.name).toBeDefined();
            expect(section.name).toEqual('name1');

        }));

    it('should create an instance of Section using build which contains subsection',
        angular.mock.inject( function (Section) {
            var obj={name:'name1',
                sections : [{name: 'name2',
                    sections: [{name: 'name3'}]
                }]
            };
            var section = Section.build(obj);
            expect(section).toBeDefined();
            expect(section.name).toBeDefined();
            expect(section.name).toEqual('name1');
            expect(section.sections.length).toEqual(1);

            expect(section.sections[0]).toEqual(jasmine.any(Section));
            expect(section.sections[0].sections.length).toEqual(1);
            expect(section.sections[0].sections[0]).toEqual(jasmine.any(Section));

        }));

    it('should create an array of Sections using buildArray',
        angular.mock.inject( function (Section) {
            var sections = Section.buildArray(sectionArray,null);
            expect(sections).toBeDefined();
            expect(sections.length).toEqual(2);
            expect(sections[0]).toEqual(jasmine.any(Section));
            expect(sections[1]).toEqual(jasmine.any(Section));
        }));


});
