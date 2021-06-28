import { readonlyTemplate } from './readonly.template';
import { biaTemplate } from './bia.template';
import { bioRamanTemplate } from './bioRaman.template';
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
  bioRamanTemplate,
  readonlyTemplate,
  proteinDesignsTemplate
];
const SUBMISSION_TEMPLATES_PUBLIC = [defaultTemplate];

export function getSubmissionTemplates(
  projects: Array<string> = []
): Array<{ description: string; name: string; title: string }> {
  const projectNames = [...projects, defaultTemplate.name];
  const filteredTemplates = projectNames.map((project) => {
    let template = SUBMISSION_TEMPLATES.find((template) => template.name.toLowerCase() == project.toLowerCase());
    if (!template) template = defaultTemplate;
    return {
      description: template.description,
      name: template.name,
      title: project
    };
  });

  return filteredTemplates;
}

export function findSubmissionTemplateByName(name: string): any {
  const tmplName = name.toLowerCase();
  const tmpl = [...SUBMISSION_TEMPLATES, ...SUBMISSION_TEMPLATES_PUBLIC].find(
    (tmplItem) => tmplItem.name.toLowerCase() === tmplName
  );

  return tmpl ? tmpl : defaultTemplate;
}
