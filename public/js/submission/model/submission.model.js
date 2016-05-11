'use strict';

module.exports =
    (function () {
        return ['_', function (_) {

            function createSubmission() {
                return {
                    accno: "",
                    title: "",
                    releaseDate: null,
                    annotations: attributes(),
                    files: [],
                    links: [],
                    contacts: [],
                    publications: []
                }
            }

            function importSubmission(obj) {

                function getAttrValue(attrName, attributes) {
                    var index = _.findIndex(obj.attributes, {name: attrName});
                    return index >= 0 ? attributes[index] : null;
                }

                var subm = createSubmission();

                subm.accno = obj.accno;
                if (obj.attributes) {
                    var rdate = getAttrValue('ReleaseDate', obj.attributes);
                    if (rdate != null) {
                        subm.releaseDate = _.isDate(rdate) ? rdate : new Date(rdate);
                    }
                    subm.title = getAttrValue('Title', obj.attributes) || "";
                }

                if (obj.section.attributes) {
                    angular.forEach(obj.section.attributes,
                        function (attr) {
                            subm.addAnnotation(attr);
                        });
                }

                if (obj.section.links) {
                    angular.forEach(obj.section.links, function (link) {
                        subm.addLink(link.url, link.attributes);
                    });
                }

                if (obj.section.files) {
                    angular.forEach(obj.section.links, function (file) {
                        subm.addFile(file.path, file.attributes);
                    });
                }

                var contacts = _.filter(obj.section.subsections, {type: 'Author'});
                var publications = _.filter(obj.section.subsections, {type: 'Publication'});

                angular.forEach(contacts, function (contact) {
                    subm.addContact(contact.attributes);
                });

                angular.forEach(publications, function (pub) {
                    subm.addPublication(pub.attributes);
                });
                return subm;
            }

            return {
                import: importSubmission
            }
        }]
    })();
