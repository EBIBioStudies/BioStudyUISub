import {Injectable, Inject} from '@angular/core';

import {Submission} from './submission'
import * as _ from 'lodash';

import {DictionaryService} from './dictionary.service';
import {PageTab} from './pagetab';

@Injectable()
export class SubmissionModel {
    constructor(@Inject(DictionaryService) private dictService: DictionaryService) {
    }

    //wrap(obj:any): PageTabGuard {
        //let ptAdapter = new PageTabGuard(this.dictService.dict());
    //    return ptAdapter.fromPageTab(pt);
    //}

    createNew(userName: string, userEmail: string): any {
        let pt = new PageTab();
        pt.asSubmission(this.dictService.dict())
        .addContact([
            {name: "Name", value: userName || ""},
            {name: "E-mail", value: userEmail || ""}
        ]);
        return pt.data();
    }

    validateSubmission(sbm: Submission): any[] {
        function requiredAttribute(itemKey, attrKey) {
            return function (sbm) {
                for (let item in sbm[itemKey].items) {
                    let attrIndex = _.findIndex(item.attributes, {name: attrKey});
                    if (attrIndex < 0) {
                        return false;
                    }
                    let attr = item.attributes[attrIndex].value;
                    return attr ? true : false;
                }
            }
        }

        var rules = {
            "Title must be at least 50 characters": function (sbm) {
                return sbm.title && sbm.title.length >= 50;
            },
            "Description must be at least 50 characters": function (sbm) {
                return sbm.description && sbm.description.length >= 50;
            },
            "Release date is required": function (sbm) {
                return sbm.releaseDate ? true : false;
            },
            "At least one contact is required": function (sbm) {
                return sbm.contacts.items.length > 0;
            }
        };

        _.forEach(_.filter(this.dictService.byKey('contact').attributes, {required: 'true'}), function (attr) {
            rules["Contact '" + attr.name + "' is required"] = requiredAttribute('contacts', attr.name);
        });

        _.forEach(_.filter(this.dictService.byKey('link').attributes, {required: 'true'}), function (attr) {
            rules["Link '" + attr.name + "' is required"] = requiredAttribute('links', attr.name);
        });

        _.forEach(_.filter(this.dictService.byKey('file').attributes, {required: 'true'}), function (attr) {
            rules["File '" + attr.name + "' is required"] = requiredAttribute('links', attr.name);
        });

        _.forEach(_.filter(this.dictService.byKey('publication').attributes, {required: 'true'}), function (attr) {
            rules["File '" + attr.name + "' is required"] = requiredAttribute('publications', attr.name);
        });

        var errors = [];
        _.forOwn(rules, function (rule, name) {
            var ok = rule(sbm);
            if (!ok) {
                errors.push(name);
            }
        });
        return errors;
    }

}