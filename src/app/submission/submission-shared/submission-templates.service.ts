import { Injectable } from '@angular/core';
import { ExtCollection } from 'app/submission/submission-transform/model/ext-submission-types';
import { readonlyTemplate } from './templates/readonly.template';
import { biaTemplate } from './templates/bia.template';
import { bioRamanTemplate } from './templates/bioRaman.template';
import { defaultTemplate } from './templates/default.template';
import { emptyTemplate } from './templates/empty.template';
import { euToxRiskTemplate } from './templates/eutoxrisk.template';
import { hecatosTemplate } from './templates/hecatos.template';
import { arrayExpressTemplate } from './templates/arrayexpress.template';
import { proteinDesignsTemplate } from './templates/proteindesigns.template';

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

@Injectable()
export class SubmissionTemplatesService {
  getSubmissionTemplates(projects: Array<string> = []): Array<{ description: string; name: string; title: string }> {
    const projectNames = [...projects, defaultTemplate.name];
    const filteredTemplates = projectNames.map((project) => {
      let template = SUBMISSION_TEMPLATES.find((json) => json.name.toLowerCase() === project.toLowerCase());
      if (!template) template = defaultTemplate;
      return {
        description: template.description,
        name: template.name,
        title: project
      };
    });

    return filteredTemplates;
  }

  findSubmissionTemplateByName(name: string): any {
    const tmplName = name.toLowerCase();
    const tmpl = [...SUBMISSION_TEMPLATES, ...SUBMISSION_TEMPLATES_PUBLIC].find(
      (tmplItem) => tmplItem.name.toLowerCase() === tmplName
    );

    return tmpl ? tmpl : defaultTemplate;
  }

  findSubmissionTemplateName(collections: ExtCollection[] = []): string {
    const collectionAccNo = collections.length === 0 ? '' : collections[0].accNo;

    if (collectionAccNo.length === 0) {
      return DEFAULT_TEMPLATE_NAME;
    }

    if (collectionAccNo.length > 0) {
      return collectionAccNo;
    }

    return READONLY_TEMPLATE_NAME;
  }
}
