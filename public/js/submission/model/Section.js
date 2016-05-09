/**
 * Created by mdylag on 06/08/15.
 */
'use strict';
var SectionRes = require('./ModelRes.json').section;


function Section(section) {
    section = section || {};
    this.type = section.type || SectionRes.type;
    this.files = section.files || [];
    this.attributes = section.attributes || [];
    this.links = section.links || [];
    this.subsections = section.subsection || [];
}

Section.prototype.addAttribute = function (attr) {
    if (!this.attributes) {
        this.attributes = [];
    }
    if (attr) {
        this.attributes.push(attr);
    }
};

Section.prototype.deleteAttribute = function (index) {
    this.attributes.splice(index, 1);
};


module.exports = Section;


