import { readonlyTemplate } from './readonly.template';
import { microbioRamanTemplate } from './microbioRaman.template';
import { emptyTemplate } from './empty.template';
import { euToxRiskTemplate } from './eutoxrisk.template';
import { hecatosTemplate } from './hecatos.template';
import { arrayExpressTemplate } from './arrayexpress.template';
import { proteinDesignsTemplate } from './proteindesigns.template';
import { ontoxTemplate } from './ontox.template';
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
  bia.biaTemplateV1,
  bia.biaTemplateV2,
  bia.biaTemplateV3,
  bia.biaTemplateV4,
  bia.biaMifaTemplateV1,
  microbioRamanTemplate,
  readonlyTemplate,
  proteinDesignsTemplate,
  ontoxTemplate
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
  subtype: string;
  version: number;
}

export function getTemplatesForCollections(collections: Array<string> = []): Array<TemplateDetail> {
  const latestTemplateByCollectionWithTemplateSubtype = {};
  const collectionsLower = collections.map((c) => c.toLowerCase());

  for (const submTemplate of SUBMISSION_TEMPLATES) {
    const tInfo = parseTemplateName(submTemplate.name);
    if (!collectionsLower.includes(tInfo.collection.toLowerCase())) {
      continue;
    }

    const collectionWithSubtype = tInfo.collection.toLowerCase() + tInfo.subtype.toLowerCase();
    const existing = latestTemplateByCollectionWithTemplateSubtype[collectionWithSubtype] || null;

    if (!existing || parseTemplateName(existing.name).version < tInfo.version) {
      latestTemplateByCollectionWithTemplateSubtype[collectionWithSubtype] = submTemplate;
    }
  }

  const templateDetail = Object.values(latestTemplateByCollectionWithTemplateSubtype).map((t: any) => {
    const tInfo = parseTemplateName(t.name);

    return {
      description: t.description,
      name: t.name,
      collection: tInfo.collection,
      displayName: tInfo.collection,
      icon: 'images/template-icons/' + tInfo.collection + '.png'
    };
  });

  templateDetail.push({
    description: defaultTemplates.v2.description,
    name: defaultTemplates.v2.name,
    collection: '',
    displayName: defaultTemplates.v2.title,
    icon: 'images/template-icons/Default.png'
  });

  const weights = ['bioimages', 'default', 'microbioraman', 'bioimages.mifa'];
  templateDetail.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    const aMatches = weights.map((w, idx) => (aName.includes(w) ? idx : -1));
    const aBestMatchWeight = Math.max(...aMatches);

    const bMatches = weights.map((w, idx) => (bName.includes(w) ? idx : -1));
    const bBestMatchWeight = Math.max(...bMatches);

    // one is in the special "top" part of the list, the other isn't
    if (aBestMatchWeight === -1 && bBestMatchWeight !== -1) {
      return 1;
    }
    if (bBestMatchWeight === -1 && aBestMatchWeight !== -1) {
      return -1;
    }

    // neither a nor b is in the top list, or both are
    if (aBestMatchWeight < bBestMatchWeight) {
      return -1;
    } else if (aBestMatchWeight > bBestMatchWeight) {
      return 1;
    } else {
      return aName.localeCompare(bName);
    }
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
  /* Example names:
  Default
  BioImages.v123
  BioImages.Mifa.v123
  */

  const templateVersion = {
    collection: 'Default',
    subtype: '',
    version: 2
  };
  if (!templateName.match(/^(.+?)(\..+?)?(\.v(\d+))?$/)) {
    return templateVersion;
  }
  // assume templateName is validated from here on

  const templateNameParts = templateName.split('.');
  templateVersion.collection = templateNameParts[0];

  if (templateNameParts.length === 2) {
    templateVersion.version = Number(templateNameParts[1]!.substring(1));
  }
  if (templateNameParts.length === 3) {
    templateVersion.version = Number(templateNameParts[2]!.substring(1));
    templateVersion.subtype = templateNameParts[1];
  }

  return templateVersion;
}
