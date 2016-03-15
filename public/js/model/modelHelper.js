var structure=require('../../../shared/model/Structure.json');
var constants = {
    COL_CSS: 'col-lg-'
}

function fillRequiredAttributes(attrs) {
        var requiredAttrs = {};

        for (var i in attrs) {
            if (attrs[i].required && !requiredAttrs[attrs[i].name]) {
                requiredAttrs[attrs[i].name]=attrs[i];
            }
        }
        return requiredAttrs;
    }


module.exports = function (SubmissionModel, $q) {
    var keyCount = 0;
    console.log('Promise created', $q);

    /**
     *
     * @param options is an object which you can
     *      options.createModelItem - function to be called to create element in section for model. for example SubmissionModel.createLink
     *      options.
     * @constructor
     */

    function Section(options) {
        this.submission_ref = options.submission;
        this.attributesKey ={};
        this.requiredAttributes= {};
        this.ref= {};
        this.model= [];
        this.colSize=3;
        this.fields = options.fields || [];
        this.colSizeCss=constants.COL_CSS + this.colSize;
        this.attributesKeyArray = function() {
            return Object.keys(this.attributesKey);
        }

        this.ui = {
            activeTabs: []
        };

        this.addAttrKey= function(key) {

        },

        this.remove= function(index) {
            this.model.splice(index,1);
            this.ui.activeTabs.splice(index,1);
            this.ref.splice(index,1);

        };


        this.createSectionItem = function(modelElement) {
            var _self = this;
            function computeColSize() {
                console.log('Compute col size');
                var length = Object.keys(_self.attributesKey).length + _self.fields.length;
                if (length>6) {
                    length=6;
                }
                _self.colSize =Math.ceil(12/length);
                _self.colSizeCss=constants.COL_CSS + _self.colSize.toString();
                return _self.colSizeCss;

            }
            function createAttribute(key) {
                key = key || 'Key_' + keyCount++;
                var attr = SubmissionModel.createAttribute({name:key,value:''});
                this.addAttribute(attr);
                computeColSize();
            }

            function addAttribute(attr) {
                console.log('add attribute');
                this.attributes[attr.name]=attr;
                _self.attributesKey[attr.name]=attr.name;
                this.ref.attributes.push(attr);

            }

            function removeAttribute(index, attr) {
                delete this.attributes[attr.name];
                this.ref.attributes.splice(attr);

            }


            var sectionElement = {
                attributes: {},
                ref : {},
                createAttribute: createAttribute,
                addAttribute: addAttribute,
                removeAttribute: removeAttribute,
                changeAttr:   function changeAttr(attr) {

                    if (attr.name) {
                        //find old reference in item.attributes
                        for (var i in this.attributes) {
                            if (this.attributes[i]==attr) {
                                delete this.attributes[i];
                            }
                        }
                        this.attributes[attr.name]=attr;
                        _self.attributesKey[attr.name]=attr.name;
                    }
                }

            };


            //parse all attributes and add
            for (var i in modelElement.attributes) {
                sectionElement.attributes[modelElement.attributes[i].name] = modelElement.attributes[i];
                if (!this.attributesKey[modelElement.attributes[i].name]) {
                    this.attributesKey[modelElement.attributes[i].name] = modelElement.attributes[i].name;
                }

            }
            computeColSize();

            sectionElement.ref=modelElement;
            this.ui.activeTabs.push(false);
            this.ref.push(modelElement);
            this.model.push(sectionElement);
            return sectionElement;

        }

        this.add = function() {
            var defer = $q.defer();

            console.log('Add new section');
            var attributes =  [];
            for (var i in this.requiredAttributes) {
                if (this.requiredAttributes[i].required) {
                    var attr = SubmissionModel.createAttribute({name: this.requiredAttributes[i].name});
                }
                attributes.push(attr);
            }
            var modelElement = options.createModelItem({attributes:attributes});
            options.addToModel.call(this,modelElement);
            var sectionElement = this.createSectionItem(modelElement);
            this.ui.activeTabs[this.ui.activeTabs.length-1]=true;
            defer.resolve();
            return defer.promise;
        };

    }

    /**
     *
     * @param options
     * element, data, type, createModelItem
     * @returns {data}
     */
    this.processModel = function (options) {
        var element = options.element;
        var data=options.data;
        var type=options.type;
        for (var i in element) {

            if ((element[i].type === type && type) || !type) {
                data.createSectionItem(element[i]);
            }
        }
        return data;
    }

    function Model(){
        this.submission = {};
        this.viewSubmission = {
            attributes: {
                Title: {name: 'Title', value: 'Default title'},
                ReleaseDate: {
                    name: 'ReleaseDate', value: new Date()
                }
            },
            section: {
                attributes: new Section({createModelItem: SubmissionModel.createAttribute,addToModel: SubmissionModel.addAttribute
                    ,submission: this.submission}),
                links: new Section({createModelItem: SubmissionModel.createLink, addToModel: SubmissionModel.addLink
                    ,submission: this.submission, fields: structure.link.fields}),
                files: new Section({createModelItem: SubmissionModel.createFile,  addToModel: SubmissionModel.addFile
                    ,submission: this.submission, fields: structure.file.fields}),
                subsections: {
                    ref: {},
                    contacts : new Section({createModelItem: SubmissionModel.createContact,  addToModel: SubmissionModel.addContact
                        ,submission: this.submission}),
                    publications: new Section({createModelItem: SubmissionModel.createPublication,  addToModel: SubmissionModel.addPublication
                        ,submission: this.submission})
                }

            }
        }

    }

    this.model = new Model();


    this.mapSubmissionAttributes = function(array) {
        var obj = {};
        for (var i in array) {
            obj[array[i].name] = array[i];
        }
        return obj;
    }

    this.setData = function(data) {
        this.model = new Model();

        this.model.submission = SubmissionModel.createSubmission(data);

        this.model.viewSubmission.attributes=this.mapSubmissionAttributes(this.model.submission.attributes);
        if (this.model.viewSubmission.attributes.ReleaseDate) {
            this.model.viewSubmission.attributes.ReleaseDate.value = new Date(this.model.viewSubmission.attributes.ReleaseDate.value || Date.now);
        } else {
            this.model.viewSubmission.attributes.ReleaseDate = {name: 'ReleaseDate', value: Date.now()}
        }

        //map study attr
        //this.model.viewSubmission.section.attributes.ref = this.model.submission.section.attributes;
        //this.model.viewSubmission.section.attributes.requiredAttributes = fillRequiredAttributes(structure.attributes.attributes);
        //this.processModel({element: this.model.submission.section.attributes, data: this.model.viewSubmission.section.attributes});

        //map links
        this.model.viewSubmission.section.links.ref = this.model.submission.section.links;
        this.model.viewSubmission.section.links.requiredAttributes = fillRequiredAttributes(structure.link.attributes);
        this.processModel({element: this.model.submission.section.links, data: this.model.viewSubmission.section.links});

        //map files
        this.model.viewSubmission.section.files.ref = this.model.submission.section.files;
        this.model.viewSubmission.section.files.requiredAttributes = fillRequiredAttributes(structure.file.attributes);
        this.processModel({element:this.model.submission.section.files, data: this.model.viewSubmission.section.files});

        //subsections

        //map contacts
        this.model.viewSubmission.section.subsections.ref=this.model.submission.section.subsections;
        //get contacts from subsection
        var contacts = [];
        for (var i in this.model.submission.section.subsections) {
            if (this.model.submission.section.subsections[i].type=='Author') {
                contacts.push(this.model.submission.section.subsections[i]);
            }
        }
        this.model.viewSubmission.section.subsections.contacts.ref = contacts;
        this.model.viewSubmission.section.subsections.contacts.requiredAttributes = fillRequiredAttributes(structure.contact.attributes);
        this.processModel({element:this.model.submission.section.subsections, data: this.model.viewSubmission.section.subsections.contacts,
            type:'Author',createModelItem: SubmissionModel.createContact} );


        //map publication
        var publications = [];
        for (var i in this.model.submission.section.subsections) {
            if (this.model.submission.section.subsections[i].type=='Publication') {
                publications.push(this.model.submission.section.subsections[i]);
            }
        }
        this.model.viewSubmission.section.subsections.publications.ref = contacts;
        this.model.viewSubmission.section.subsections.publications.requiredAttributes = fillRequiredAttributes(structure.publication.attributes);
        this.processModel({element:this.model.submission.section.subsections, data: this.model.viewSubmission.section.subsections.publications,
            type: 'Publication',createModelItem: SubmissionModel.createPublication} );

    };


    this.union = function (element, type, model) {

    };


}