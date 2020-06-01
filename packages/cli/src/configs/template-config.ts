import { ITemplateData } from '@meeco/sdk';
import { FastItemTemplatesResponse } from '@meeco/vault-api-sdk';

export class TemplateConfig {
  static readonly kind = 'Template';
  static readonly pluralKind = 'Templates';

  static encodeFromJSON(json: ITemplateData) {
    return {
      kind: TemplateConfig.kind,
      spec: {
        ...json.template,
        slots: json.slots
      }
    };
  }

  static encodeListFromJSON(json: FastItemTemplatesResponse) {
    return {
      kind: TemplateConfig.pluralKind,
      spec: json.item_templates.map(template => template.name)
    };
  }
}