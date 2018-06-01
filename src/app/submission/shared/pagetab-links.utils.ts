import * as _ from 'lodash';

/**
 * Utility class bridging the differences between PageTab's specs for links and the app's internal submission model.
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
export class LinksUtils {
    static URL_REGEXP = /^(http|https|ftp):\/\/.+$/;

    /**
     * Converts a PageTab link to a submission one, typically used when loading a study. It adds a 'Pointer' attribute
     * whose value is equal to the root 'url' property. It also prefixes the pointer with the 'Type' attribute's value
     * if not empty (it's the prefix of a prefix:ID link).
     * NOTE: In the case of prefix:ID links, PageTab's 'url' root property is set to the ID.
     * @param {Object} linkObj - Submission model's object for the link.
     * @returns {Object} Submission-ready link object.
     */
    static toUntyped(linkObj: {url: string, attributes: Object[]}): Object {
        const pointerAttr = {name: 'Pointer', value: linkObj.url};
        let typeIdx = _.findIndex(linkObj.attributes, ['name', 'Type']);
        let typePrefix;         //value of the 'Type' attribute when the link is of type prefix:ID

        linkObj.attributes.push(pointerAttr);

        //Abnormal PageTab link from the server => normalises adding 'Type' attribute
        if (typeIdx == -1) {
            typeIdx = linkObj.attributes.length;
            linkObj.attributes.push({name: 'Type', value: ''});
        }

        typePrefix = linkObj.attributes[typeIdx]['value'];

        //The 'Type' attribute is not blank => prefix:ID link
        if (typePrefix) {
            pointerAttr.value = typePrefix + ':' + linkObj.url;
        }

        linkObj.attributes.splice(typeIdx, 1);

        delete linkObj.url;
        return linkObj;
    }

    /**
     * Converts a submission link to a PageTab one, typically used when saving a study. It uses the format of the
     * link's pointer to determine if a 'Type' attribute is required. It also renames the root-level 'pointer'
     * property to PageTab's expected 'url'.
     * NOTE: In the case of prefix:ID links, the 'Type' attribute must be set to the pre
     * @param {Object} linkObj - PageTab's data object for the link.
     * @returns {Object} PageTab-ready link object.
     */
    static toTyped(linkObj: {pointer: string, attributes: Object[]}) {
        const typeAttr = {name: 'Type', value: ''};
        const isUrl = this.URL_REGEXP.test(linkObj.pointer);
        let linkParts;         //prefix and ID of the link

        linkObj.attributes.push(typeAttr);
        if (linkObj.pointer) {
            if (isUrl) {
                linkObj['url'] = linkObj.pointer;
            } else {
                linkParts = linkObj.pointer.split(':');

                //It must be a prefix:ID link
                if (linkParts.length > 1) {
                    typeAttr.value = linkParts[0];
                    linkObj['url'] = linkParts[1];

                //Invalid link value
                //NOTE: field values could be backed up regardless of their validity.
                } else {
                    linkObj['url'] = linkParts[0];
                }
            }

        //Empty submission link object => normalises adding a url property
        //NOTE: Only when creating brand new submissions, this anomalous situation will apply. Otherwise, this would
        //never be sent since it is not a valid link if the pointer is required and it's blank data (and therefore
        //scrapped) if the pointer is not required.
        } else {
            linkObj['url'] = '';
        }

        delete linkObj.pointer;
        return linkObj;
    }
}