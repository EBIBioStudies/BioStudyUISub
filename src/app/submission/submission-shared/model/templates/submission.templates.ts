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

export interface TemplateDetail {
  description: string;
  name: string;
  collection: string;
  displayName: string;
}

export function getTemplatesForCollections(collections: Array<string> = []): Array<TemplateDetail> {
  const templateDetail = collections.map((collection) => {
    let template = SUBMISSION_TEMPLATES.find((json) => json.name.toLowerCase() === collection.toLowerCase());
    if (!template) {
      template = defaultTemplate;
    }

    return {
      description: template.description,
      name: template.name,
      collection,
      displayName: collection
    };
  });

  return [
    ...templateDetail,
    {
      description: defaultTemplate.description,
      name: defaultTemplate.name,
      displayName: defaultTemplate.name,
      collection: ''
    }
  ];
}

export function findTemplateByName(name: string): any {
  const tmplName = name.toLowerCase();
  const tmpl = [...SUBMISSION_TEMPLATES, ...SUBMISSION_TEMPLATES_PUBLIC].find(
    (tmplItem) => tmplItem.name.toLowerCase() === tmplName
  );

  return tmpl ? tmpl : defaultTemplate;
}
