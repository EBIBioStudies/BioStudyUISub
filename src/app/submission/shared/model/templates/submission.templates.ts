import {BIATemplate} from './bia.template';
import {DefaultTemplate} from './default.template';
import {EmptyTemplate} from './empty.template';
import {EutoxriskTemplate} from './eutoxrisk.template';
import {HecatosTemplate} from './hecatos.template';

export const DEFAULT_TEMPLATE_NAME = 'Default';
export const EMPTY_TEMPLATE_NAME = 'Empty';

const SUBMISSION_TEMPLATES = [EutoxriskTemplate, HecatosTemplate, EmptyTemplate];
const SUBMISSION_TEMPLATES_PUBLIC = [BIATemplate, DefaultTemplate];

export function getSubmissionTemplates(projects: Array<string> = []): Array<{ name: string, description: string }> {
    const projectNames = projects.map(p => p.toLowerCase());

    return [...SUBMISSION_TEMPLATES.filter(t => projectNames.includes(t.name.toLowerCase())),
        ...SUBMISSION_TEMPLATES_PUBLIC].map(t => ({name: t.name, description: t.description}));
}

export function findSubmissionTemplateByName(name: string): any {
    const tmplName = name.toLowerCase();
    const tmpl = [...SUBMISSION_TEMPLATES, ...SUBMISSION_TEMPLATES_PUBLIC].find(tmpl => tmpl.name.toLowerCase() === tmplName);
    return tmpl ? tmpl : DefaultTemplate;
}