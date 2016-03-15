'use strict';
var ModelRes = require('./ModelRes.json');
var modelStructure = require('./Structure.json');

/**
 * Created by mdylag on 12/08/15.
 */


function SubmissionFactory() {};

var GenericElement= {
    attributes: [],
    addAttribute : function(name, value) {
        attributes.push({name: name, value: value});
    }
}

function addAttribute(attr) {
    if (!this.attributes) {
        this.attributes = [];
    }
    this.attributes.push(attr || SubmissionFactory.prototype.createAttribute());
}


var uidAttribute  = 0;
SubmissionFactory.prototype.createAttribute = function (options) {
    options = options || {writable : true};
    var attribute = Object.create({}, {
        uid: {writable: false, configurable: false, value: ++uidAttribute },
        writable: { writable: false, configurable: false, value: options.writable}
});

    attribute.name = options.name || '';
    attribute.value = options.value || '';
    return attribute;
}

SubmissionFactory.prototype.createAttributes = function (array) {
    var attributes = [];
    for (var i in array) {
        attributes.push(SubmissionFactory.prototype.createAttribute(array[i]));
    }
    return attributes;
}

/**
 * Add an attribute to the all elements in array.
 * @param array
 * @param type
 */
SubmissionFactory.prototype.addAttributeTo = function(array, attr, type) {
    var attr = attr || SubmissionFactory.prototype.createAttribute();

    for (var i in array) {
        if (array[i].attributes) {
            if (type) {
                if (array[i].type === type) {
                    array[i].attributes.push(attr);
                }
            } else {
                array[i].attributes.push(attr);
            }
        }
    }
}


SubmissionFactory.prototype.addAttribute = addAttribute;


SubmissionFactory.prototype.createLink = function (options) {
    options = options || {};
    var link = Object.create({
        addAttribute: addAttribute
    });

    link.url = options.url || '';
    link.attributes = options.attributes || [];
    return link;
}

SubmissionFactory.prototype.addLink = function(link) {
    if (!this.links) {
        this.links = [];
    }
    this.links.push(SubmissionFactory.prototype.createLink(link));

}

SubmissionFactory.prototype.createFile = function (options) {
    options = options || {};
    var file = Object.create({
        addAttribute: addAttribute
    });
    file.path = options.path || '';
    file.attributes = options.attributes || [];
    return file;
}



SubmissionFactory.prototype.addFile = function(file) {
    if (!this.files) {
        this.files = [];
    }
    this.files.push(SubmissionFactory.prototype.createFile(file));
}


SubmissionFactory.prototype.createSubmission = function (options) {
    options = options || {};
    var submission = Object.create({}, {
        accessTags : {writable: true, configurable: false, value: options.accessTags || ModelRes.accessTags},
        RootPath : {writable: false, configurable: false, value: options.RootPath || ''},
        id: {writable: false, configurable: false, value: options.id || ''},
        idSave: {writable: false, configurable: false, value: options.idSave || ''},
    });
    submission.addContact = SubmissionFactory.prototype.addContact;

    submission.accno =  options.accno || options.accession || ModelRes.accno;
    submission.type =  options.type || ModelRes.type;
    submission.attributes = options.attributes ||  SubmissionFactory.prototype.createAttributes(   [         {
            "name": "Title",
            "value": "",
            "writable": false
        },
        {
            "name": "ReleaseDate",
            "value": Date.now(),
            "writable": false

        }]
    );

    submission.section = this.createSection(options.section);
    return submission;
}


SubmissionFactory.prototype.addItemToArray = function (array, factory) {
    if (array && factory) {
        array.push(factory());
        return array;
    }
    throw new Error("Parameters are undefined");

}

SubmissionFactory.prototype.createSection = function (options) {
    options = options || {};
    var section= Object.create({});
    section.accno= options.accno || ModelRes.section.accno;
    section.type = options.type || ModelRes.section.type;
    section.files =  options.files || [];
    section.attributes = options.attributes || [];
    section.links = options.links || [];
    section.subsections = options.subsections || [];
    //make a reference from subsection contact to
    return section;
}



SubmissionFactory.prototype.createContact = function () {

    var contact= SubmissionFactory.prototype.createSubSection({
        type: modelStructure.contact.type
    });

    //Consider use eager initaliztion for this list.
    for (var i in modelStructure.contact.attributes) {
        if (modelStructure.contact.attributes[i].required===true) {
            SubmissionFactory.prototype.addAttribute.call(contact,SubmissionFactory.prototype.createAttribute({name: modelStructure.contact.attributes[i].name}));
        }
    }
    return contact;
}

SubmissionFactory.prototype.addContact = function(contact) {
    if (!this.subsections) {
        this.subsections = [];
    }
    contact = contact || SubmissionFactory.prototype.createContact();

    this.subsections.push(contact);
    return contact;
}

SubmissionFactory.prototype.createPublication = function () {
    return SubmissionFactory.prototype.createSubSection({
        type: ModelRes.section.subsection.publication.type,
        attributes: [SubmissionFactory.prototype.createAttribute({name : 'Pub. Med. Id', value: '', writable: false})]
    });
}

SubmissionFactory.prototype.addPublication = function(publication) {
    if (!this.subsections) {
        this.subsections = [];
    }
    publication = publication || SubmissionFactory.prototype.createPublication();
    this.subsections.push(publication);
}


var uidSubSection = 0;
SubmissionFactory.prototype.createSubSection = function (options) {
    options = options || {};
    var subsection = Object.create({}, {
        accession: {writable: false, configurable: false, value: options.accession || ''},
        uid: {writable: false, configurable: false, value: options.type || ++uidSubSection }
    });
    subsection.type = options.type || '';
    subsection.attributes = options.attributes || [];

    return subsection;
}



SubmissionFactory.prototype.addSubSection = function(subsection) {
    //init subsection array when not in
    if (!this.subsections) {
        this.subsections = [];
    }
    if (subsection) {
        this.subsections.push(subsection);
    }
}





module.exports = new SubmissionFactory();