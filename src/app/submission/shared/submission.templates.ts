import {ATTACH_TO_ATTR, PageTab} from './pagetab.model';
import {filterAttributesByName} from './pagetab-attributes.utils';

import {DefaultTemplate} from './default.template';
import {HecatosTemplate} from './hecatos.template';
import {EutoxriskTemplate} from './eutoxrisk.template';

const SUBMISSION_TEMPLATES = [EutoxriskTemplate, HecatosTemplate, DefaultTemplate];

export const DEFAULT_TEMPLATE_NAME = 'Default';
export const SUBMISSION_TEMPLATE_NAMES = SUBMISSION_TEMPLATES.map(tmpl => tmpl.name);

export function findSubmissionTemplateName(pageTab: PageTab): string {
    const attachToValues: string[] = filterAttributesByName(pageTab, ATTACH_TO_ATTR)
        .filter(at => String.isDefinedAndNotEmpty(at.value))
        .map(at => at.value!);
    return attachToValues.length > 1 ? DEFAULT_TEMPLATE_NAME : attachToValues[0];
}

export function findSubmissionTemplateByName(tmplName: string): any {
    const tmpl = SUBMISSION_TEMPLATES.find(tmpl => tmpl.name.toLowerCase() === tmplName.toLowerCase());
    return tmpl ? tmpl : DefaultTemplate;
}