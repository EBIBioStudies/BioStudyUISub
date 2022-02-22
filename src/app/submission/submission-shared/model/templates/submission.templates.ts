import { readonlyTemplate } from './readonly.template';
import { biaTemplateV1 } from './bia/bia.template.v1';
import { biaTemplateV2 } from './bia/bia.template.v2';
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
  biaTemplateV1,
  biaTemplateV2,
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

interface TemplateVersion {
  collection: string;
  version: number;
}

export function getTemplatesForCollections(collections: Array<string> = []): Array<TemplateDetail> {
  const collectionNames = [...collections, defaultTemplate.name];

  const templateDetail = collectionNames.map((collection) => {
    const template = SUBMISSION_TEMPLATES.reduce((latest, t) => {
      const tInfo = parseTemplateName(t.name);
      const latestInfo = parseTemplateName(latest.name);
      if (tInfo.collection.toLowerCase() === collection.toLowerCase()) {
        if (latestInfo.collection.toLowerCase() === collection.toLowerCase()) {
          return tInfo.version > latestInfo.version ? t : latest;
        } else {
          return t;
        }
      }
      return latest;
    }, defaultTemplate);

    return {
      description: template.description,
      name: template.name,
      collection,
      displayName: collection
    };
  });

  return templateDetail;
}

export function findTemplateByName(name: string): any {
  const tmplName = name.toLowerCase();
  const tmpl = [...SUBMISSION_TEMPLATES, ...SUBMISSION_TEMPLATES_PUBLIC].find(
    (tmplItem) => tmplItem.name.toLowerCase() === tmplName
  );

  return tmpl ? tmpl : defaultTemplate;
}

function parseTemplateName(templateName: string): TemplateVersion {
  const templateNameRe = /^(.+?)(?:\.v(\d+))?$/;
  const matches = templateNameRe.exec(templateName) || [null, '', 0];
  return {
    collection: matches[1],
    version: !!matches[2] ? Number(matches[2]) : 0
  } as TemplateVersion;
}
