var SubmissionModel = require('../../../shared/model/SubmissionModel');
var _ = require('lodash');


function AttributeKeys() {

    this.keys = {};
    this.length = 0;
    this.add = function (name) {
        if (!this.keys[name]) {
            ++this.length;
            this.keys[name] = {count: 1, value: name};
        } else {
            this.keys[name].count++;
        }
    }
    this.remove = function (name) {
        if (this.keys[name]) {
            --this.keys[name].count;
            if (this.keys[name].count === 0) {
                --this.length
                delete this.keys[name];
            }
        }
    }

}
/**
Constructor for create a singlr element in item
 */
function Element(options) {
    this.model = options.model || {};
    this.attributes = {};
    this.create = function(model) {
        this.model = model;
        this.createAttributes();
    }
    this.createAttributes = function() {
        _self = this;
        _(this.model.attributes).forEach(function(obj, key) {
            console.log('create attrs', obj, obj.name);
            _self.attributes[obj.name]=obj;
        });
    };

    this.addAttribute = function(attr) {
        this.attributes[attr.name] = attr;
    }
    this.removeAttribute = function(name) {
        delete this.attributes[name];

    }
    this.changeAttribute= function(newVal, oldVal) {
        if (this.attributes[oldVal]) {
            if (!this.attributes[newVal]) {
                this.attributes[newVal] = this.attributes[oldVal];
                delete this.attributes[newVal];
            }
        }
    }




}

function ModuleItem(options) {
    this.model = options.model;
    this.fields = options.fieldsCount;
    this.items = [];
    this.colSizeCss = 'col-lg-6';
    this.attributeKeys = new AttributeKeys();
    this.ui = {
        activeTabs:[]
    }
    var _self = this;
    function computeColSize() {
        var length = _self.fields + _self.attributeKeys.length;
        if (length > 6) {
            length = 6;
        }
        var colSize = Math.ceil(12 / length);
        _self.colSizeCss = 'col-lg-' + colSize.toString();
    }

    this.addAttrKeys= function(item) {
        for (var j = 0; j < item.attributes.length; j++) {
            this.attributeKeys.add(item.attributes[j].name);
        }
    }

    this.add = function () {
        //SubmissionModel.addLink
        var item=options.addItem();
        this.addAttrKeys(item);
        computeColSize();
        this.ui.activeTabs.push(true);
        computeColSize();
    }
    this.createAttr = function (item) {
        var attr = SubmissionModel.addAttribute.call(item);
        this.attributeKeys.add(attr.name);
        computeColSize();
        return attr;


    }
    this.changeAttr = function (newVal, oldVal) {
        console.log('Remove old',oldVal, 'Add ',newVal);
        this.attributeKeys.remove(oldVal);
        this.attributeKeys.add(newVal);
    };


    this.remove = function (index, item) {
        //remove attribute from attributes
        _(item.attributes).forEach(function (el) {
            var _index = _.findIndex(this.attributes, {name: el.name, value: el.value});
            if (_index > -1) {
                this.attributes.splice(_index, 1)
            }
        });
        //compute attributes key
        this.model.splice(index, 1);
        computeColSize();

        //this.ui.activeTabs.splice(index,1);
        //this.ref.splice(index,1);
    }
    this.deleteAttr = function (name) {
        this.attributeKeys.remove(name);
        computeColSize();

    };

    this.create = function () {
        for (var i = 0; i < this.model.length; i++) {
            //this.items.push(createItem());
            //count number of fields
            this.addAttrKeys(this.model[i]);
        }
        computeColSize();
    }


}


function ModuleHelper(model, fieldsCount) {
    this.model = model;
    this.section = {};
    if (this.model.section.links) {
        this.section.links = new ModuleItem({
            model: this.model.section.links,
            fieldsCount: 1,
            addItem: _.bind(SubmissionModel.addLink, this.model.section)
        });
        this.section.links.create();
    }
    if (this.model.section.files) {
        this.section.files = new ModuleItem({
            model: this.model.section.files,
            fieldsCount: 1,
            addItem: _.bind(SubmissionModel.addFile, this.model.section)
        });
        this.section.files.create();
    }
    this.section.subsection = {};
    var contacts=_.filter(model.section.subsections, {type: 'Contact'});
    var publications=_.filter(model.section.subsections, {type: 'Publication'});

    if (contacts) {
        this.section.subsection.contacts = new ModuleItem({
            model: contacts,
            fieldsCount: 0,
            addItem: _.bind(SubmissionModel.addContact, this.model.section)
        });
        this.section.subsection.contacts.create();

    }
    if (publications) {
        this.section.subsection.publications = new ModuleItem({
            model: publications,
            fieldsCount: 0,
            addItem: _.bind(SubmissionModel.addPublication, this.model.section)
        });
        this.section.subsection.publications.create();

    }

}


/**
 *
 * @param model -
 * @param fieldsCount - number of fields for item. For example link has one field url.
 * @returns {ModuleHelper} - return a new ModuleHelper object
 */
function createSubmModel(model) {
    return new ModuleHelper(model);
}

function createAttributeKeys() {
    return new AttributeKeys();
}
/**
 *
 * @param options
 * @returns {ModuleItem}
 */
function createModuleItem(options) {
    return new ModuleItem(options);
}

function createElement(options) {
    var el= new Element(options);
    el.createAttributes();
    return el;
}



module.exports = {
    createSubmModel: createSubmModel,
    createAttributeKeys: createAttributeKeys,
    createModuleItem: createModuleItem,
    createElement: createElement,
};
//module.exports = createAttributesKey;

//AttribuesKey:AttribuesKey};