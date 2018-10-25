import {EutoxriskTemplate} from './eutoxrisk.template';
import {HecatosTemplate} from './hecatos.template';
import {BIATemplate} from './bia.template';
import {DefaultTemplate} from './default.template';
import {EmptyTemplate} from './empty.template';

export const DEFAULT_TEMPLATE_NAME = 'Default';
export const EMPTY_TEMPLATE_NAME = 'Empty';

export const SUBMISSION_TEMPLATES = [EutoxriskTemplate, HecatosTemplate, BIATemplate, DefaultTemplate, EmptyTemplate];
export const SUBMISSION_TEMPLATE_NAMES = SUBMISSION_TEMPLATES.map(tmpl => tmpl.name);

export function findSubmissionTemplateByName(name: string): any {
    const tmplName = name.toLowerCase();
    const tmpl = SUBMISSION_TEMPLATES.find(tmpl => tmpl.name.toLowerCase() === tmplName);
    return tmpl ? tmpl : DefaultTemplate;
}