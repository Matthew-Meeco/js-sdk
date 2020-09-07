import { expect } from '@oclif/test';
import { readFileSync } from 'fs';
import {
  DEFAULT_CLASSIFICATION_NAME,
  DEFAULT_CLASSIFICATION_SCHEME,
  MOCK_NEXT_PAGE_AFTER,
} from '../../../src/util/constants';
import { customTest, outputFixture, testEnvironmentFile, testUserAuth } from '../../test-helpers';

describe('templates:list', () => {
  customTest
    .stderr()
    .stdout()
    .nock('https://sandbox.meeco.me/vault', api => {
      api
        .get('/item_templates')
        .matchHeader('Authorization', '2FPN4n5T68xy78i6HHuQ')
        .matchHeader('Meeco-Subscription-Key', 'environment_subscription_key')
        .reply(200, response);
    })
    .run(['templates:list', ...testUserAuth, ...testEnvironmentFile])
    .it(
      'fetches a list of available templates (no classification scheme or name provided)',
      ctx => {
        const expected = readFileSync(outputFixture('list-templates.output.yaml'), 'utf-8');
        expect(ctx.stdout).to.contain(expected);
      }
    );

  customTest
    .stderr()
    .stdout()
    .nock('https://sandbox.meeco.me/vault', api => {
      api
        .get('/item_templates')
        .query({
          'by_classification[scheme]': DEFAULT_CLASSIFICATION_SCHEME,
          'by_classification[name]': DEFAULT_CLASSIFICATION_NAME,
        })
        .matchHeader('Authorization', '2FPN4n5T68xy78i6HHuQ')
        .matchHeader('Meeco-Subscription-Key', 'environment_subscription_key')
        .reply(200, response);
    })
    .run([
      'templates:list',
      ...testUserAuth,
      ...testEnvironmentFile,
      '-s',
      DEFAULT_CLASSIFICATION_SCHEME,
      '-n',
      DEFAULT_CLASSIFICATION_NAME,
    ])
    .it('fetches a list of available templates scoped to classification scheme and name', ctx => {
      const expected = readFileSync(outputFixture('list-templates.output.yaml'), 'utf-8');
      expect(ctx.stdout).to.contain(expected);
    });

  customTest
    .stderr()
    .stdout()
    .nock('https://sandbox.meeco.me/vault', api => {
      api
        .get('/item_templates')
        .query({
          like: DEFAULT_CLASSIFICATION_NAME,
        })
        .matchHeader('Authorization', '2FPN4n5T68xy78i6HHuQ')
        .matchHeader('Meeco-Subscription-Key', 'environment_subscription_key')
        .reply(200, response);
    })
    .run([
      'templates:list',
      ...testUserAuth,
      ...testEnvironmentFile,
      '-l',
      DEFAULT_CLASSIFICATION_NAME,
    ])
    .it('fetches a list of available templates searching by label', ctx => {
      const expected = readFileSync(outputFixture('list-templates.output.yaml'), 'utf-8');
      expect(ctx.stdout).to.contain(expected);
    });

  customTest
    .stderr()
    .stdout()
    .nock('https://sandbox.meeco.me/vault', api => {
      api
        .get('/item_templates')
        .matchHeader('Authorization', '2FPN4n5T68xy78i6HHuQ')
        .matchHeader('Meeco-Subscription-Key', 'environment_subscription_key')
        .reply(200, responsePart1)
        .get('/item_templates')
        .query({ next_page_after: MOCK_NEXT_PAGE_AFTER })
        .matchHeader('Authorization', '2FPN4n5T68xy78i6HHuQ')
        .matchHeader('Meeco-Subscription-Key', 'environment_subscription_key')
        .reply(200, responsePart2);
    })
    .run(['templates:list', ...testUserAuth, ...testEnvironmentFile])
    .it('fetches all templates when paged', ctx => {
      const expected = readFileSync(outputFixture('list-templates.output.yaml'), 'utf-8');
      expect(ctx.stdout).to.contain(expected);
    });
});

const response = {
  item_templates: [
    {
      name: 'food',
      slots_ids: ['steak', 'pizza', 'yoghurt'],
    },
    {
      name: 'drink',
      slot_ids: ['yoghurt', 'water', 'beer'],
    },
    {
      name: 'activities',
      slot_ids: ['sport', 'recreational'],
    },
  ],
  slots: [],
  attachments: [],
  thumbnails: [],
  classification_nodes: [],
  meta: [],
};

const responsePart1 = {
  ...response,
  item_templates: [
    {
      name: 'food',
      slots_ids: ['steak', 'pizza', 'yoghurt'],
    },
    {
      name: 'drink',
      slot_ids: ['yoghurt', 'water', 'beer'],
    },
  ],
  next_page_after: MOCK_NEXT_PAGE_AFTER,
  meta: [
    {
      next_page_exists: true,
    },
  ],
};

const responsePart2 = {
  ...response,
  item_templates: [
    {
      name: 'activities',
      slot_ids: ['sport', 'recreational'],
    },
  ],
  meta: [
    {
      next_page_exists: false,
    },
  ],
};
