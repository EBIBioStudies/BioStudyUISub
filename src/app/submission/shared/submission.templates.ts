import {ATTACH_TO_ATTR, PageTab} from './pagetab.model';
import {filterAttributesByName} from './pagetab-attributes.utils';

import {DefaultTemplate} from './default.template';
import {HecatosTemplate} from './hecatos.template';
import {EutoxriskTemplate} from './eutoxrisk.template';
import {EmptyTemplate} from './empty.template';

const SUBMISSION_TEMPLATES = [EutoxriskTemplate, HecatosTemplate, DefaultTemplate, EmptyTemplate];

export const DEFAULT_TEMPLATE_NAME = 'Default';
export const EMPTY_TEMPLATE_NAME = 'Empty';
export const SUBMISSION_TEMPLATE_NAMES = SUBMISSION_TEMPLATES.map(tmpl => tmpl.name);

export function findSubmissionTemplateName(pageTab: PageTab): string {
    const attachToValues: string[] = filterAttributesByName(pageTab, ATTACH_TO_ATTR)
        .filter(at => String.isDefinedAndNotEmpty(at.value))
        .map(at => at.value!);
    return attachToValues.length === 1 ? attachToValues[0] : DEFAULT_TEMPLATE_NAME;
}

export function findSubmissionTemplateByName(name: string): any {
    const tmplName = name.toLowerCase();
    const tmpl = SUBMISSION_TEMPLATES.find(tmpl => tmpl.name.toLowerCase() === tmplName);
    return tmpl ? tmpl : DefaultTemplate;
}