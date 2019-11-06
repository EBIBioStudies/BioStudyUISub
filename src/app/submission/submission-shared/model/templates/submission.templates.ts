import { biaTemplate } from './bia.template';
import { defaultTemplate } from './default.template';
import { emptyTemplate } from './empty.template';
import { euToxRiskTemplate } from './eutoxrisk.template';
import { hecatosTemplate } from './hecatos.template';
import { arrayExpressTemplate } from './arrayexpress.template';

export const DEFAULT_TEMPLATE_NAME = 'Default';
export const EMPTY_TEMPLATE_NAME = 'Empty';

const SUBMISSION_TEMPLATES = [arrayExpressTemplate, euToxRiskTemplate, hecatosTemplate, emptyTemplate];
const SUBMISSION_TEMPLATES_PUBLIC = [biaTemplate, defaultTemplate];

export function getSubmissionTemplates(projects: Array<string> = []): Array<{ description: string, name: string }> {
    const projectNames = projects.map(p => p.toLowerCase());

    return [...SUBMISSION_TEMPLATES.filter(t => projectNames.includes(t.name.toLowerCase())),
        ...SUBMISSION_TEMPLATES_PUBLIC].map(t => ({name: t.name, description: t.description}));
}

export function findSubmissionTemplateByName(name: string): any {
    const tmplName = name.toLowerCase();
    const tmpl = [...SUBMISSION_TEMPLATES, ...SUBMISSION_TEMPLATES_PUBLIC].find(tmplItem => tmplItem.name.toLowerCase() === tmplName);
    return tmpl ? tmpl : defaultTemplate;
}
