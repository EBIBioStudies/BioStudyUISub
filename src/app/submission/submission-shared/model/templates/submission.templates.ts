import { readonlyTemplate } from './readonly.template';
import { microbioRamanTemplate } from './microbioRaman.template';
import { emptyTemplate } from './empty.template';
import { euToxRiskTemplate } from './eutoxrisk.template';
import { hecatosTemplate } from './hecatos.template';
import { arrayExpressTemplate } from './arrayexpress.template';
import { proteinDesignsTemplate } from './proteindesigns.template';
import * as bia from './bia';
import * as defaultTemplates from './default';

export const DEFAULT_TEMPLATE_NAME = 'Default';
export const EMPTY_TEMPLATE_NAME = 'Empty';
export const READONLY_TEMPLATE_NAME = 'ReadOnly';

const SUBMISSION_TEMPLATES = [
  arrayExpressTemplate,
  euToxRiskTemplate,
  hecatosTemplate,
  emptyTemplate,
  bia.biaImplicitTemplateV0,
  bia.biaTemplateV1,
  bia.biaTemplateV2,
  bia.biaTemplateV3,
  bia.biaTemplateV4,
  microbioRamanTemplate,
  readonlyTemplate,
  proteinDesignsTemplate
];
const SUBMISSION_TEMPLATES_PUBLIC = [defaultTemplates.v1, defaultTemplates.v2];

export interface TemplateDetail {
  description: string;
  name: string;
  collection?: string;
  displayName: string;
  icon: string;
}

interface TemplateVersion {
  collection: string;
  version: number;
}

export function getTemplatesForCollections(collections: Array<string> = []): Array<TemplateDetail> {
  const templateDetail = collections.map((collection) => {
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
    }, defaultTemplates.v2);

    return {
      description: template.description,
      name: template.name,
      collection,
      displayName: collection,
      icon: 'images/template-icons/' + collection + '.png'
    };
  });

  templateDetail.push({
    description: defaultTemplates.v2.description,
    name: defaultTemplates.v2.name,
    collection: '',
    displayName: defaultTemplates.v2.title,
    icon: 'images/template-icons/Default.png'
  });

  const weights = ['bioimages', 'default', 'microbioraman'];
  templateDetail.sort((a, b) => {
    const aName = a.displayName.toLowerCase();
    const bName = b.displayName.toLowerCase();
    let result;
    if (weights.indexOf(aName) >= 0) {
      result = weights.indexOf(bName) >= 0 ? (weights.indexOf(aName) < weights.indexOf(bName) ? -1 : 1) : -1;
    } else {
      result = aName.localeCompare(bName);
    }
    return result;
  });

  return templateDetail;
}

export function findTemplateByName(name: string): any {
  const tmplName = name.toLowerCase();
  const tmpl = [...SUBMISSION_TEMPLATES, ...SUBMISSION_TEMPLATES_PUBLIC].find(
    (tmplItem) => tmplItem.name.toLowerCase() === tmplName
  );

  return tmpl ? tmpl : defaultTemplates.v2;
}

function parseTemplateName(templateName: string): TemplateVersion {
  const templateNameRe = /^(.+?)(?:\.v(\d+))?$/;
  const matches = templateNameRe.exec(templateName) || [null, '', 0];
  return {
    collection: matches[1],
    version: !!matches[2] ? Number(matches[2]) : 0
  } as TemplateVersion;
}
