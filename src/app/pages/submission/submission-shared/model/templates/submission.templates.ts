import { readonlyTemplate } from './readonly.template';
import { biaTemplate } from './bia.template';
import { defaultTemplate } from './default.template';
import { emptyTemplate } from './empty.template';
import { euToxRiskTemplate } from './eutoxrisk.template';
import { hecatosTemplate } from './hecatos.template';
import { arrayExpressTemplate } from './arrayexpress.template';
import { proteinDesignsTemplate } from './proteindesigns.template';

export const DEFAULT_TEMPLATE_NAME = 'Default';
export const EMPTY_TEMPLATE_NAME = 'Empty';
export const READONLY_TEMPLATE_NAME = 'ReadOnly';

const SUBMISSION_TEMPLATES = [
  arrayExpressTemplate,
  euToxRiskTemplate,
  hecatosTemplate,
  emptyTemplate,
  biaTemplate,
  readonlyTemplate,
  proteinDesignsTemplate
];
const SUBMISSION_TEMPLATES_PUBLIC = [defaultTemplate, proteinDesignsTemplate];

export function getSubmissionTemplates(projects: Array<string> = []): Array<{ description: string, name: string }> {
  const projectNames: string[] = projects.map((project) => project.toLowerCase());
  const filteredTemplates = SUBMISSION_TEMPLATES.filter((template) => projectNames.includes(template.name.toLowerCase()));
  const templates = [...filteredTemplates, ...SUBMISSION_TEMPLATES_PUBLIC];

  return templates.map((template) => ({name: template.name, description: template.description}));
}

export function findSubmissionTemplateByName(name: string): any {
  const tmplName = name.toLowerCase();
  const tmpl = [...SUBMISSION_TEMPLATES, ...SUBMISSION_TEMPLATES_PUBLIC].find(tmplItem => tmplItem.name.toLowerCase() === tmplName);
  return tmpl ? tmpl : defaultTemplate;
}
