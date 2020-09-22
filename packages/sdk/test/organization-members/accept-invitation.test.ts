import { expect } from '@oclif/test';
import { OrganizationMembersService } from '../../src/services/organization-members-service';
import {
  customTest,
  environment,
  getInputFixture,
  getOutputFixture,
  testUserAuthFixture,
} from '../test-helpers';

describe('Organization-members accept-invitation', () => {
  customTest
    .mockCryppo()
    .nock('https://sandbox.meeco.me/vault', mockVault)
    .it('Requests the creation of a new organization member invitation', async () => {
      const input = getInputFixture('accept-organization-members-invitation.input.json');
      const service = new OrganizationMembersService(environment);
      const result = await service.acceptInvite(
        testUserAuthFixture.vault_access_token,
        input.token
      );

      const { privateKey, publicKey, ...expectedSpec } = getOutputFixture(
        'accept-organization-members-invitation.output.json'
      );
      expect(result.connection).to.eql(expectedSpec);
    });
});

const response = {
  connection: {
    own: {
      id: 'c0d1988f-b404-4402-8040-33f0201dc725',
      encrypted_recipient_name: null,
      integration_data: {
        intent: 'member',
        organization_id: '5a45e7ca-86c5-4a1f-9962-dc3775c3c7bd',
        organization_member_role: 'admin',
        organization_member_id: 'cfbf3f4e-735b-46a1-97ee-8cc13c0bb2dd',
      },
      connection_type: 'member',
      user_image: 'http://localhost:3000/images/69074548-24cb-403d-828c-09af6002e1c3',
      user_type: 'organization_agent',
      user_public_key: '--PUBLIC_KEY--ABCD',
      user_keypair_external_id: null,
    },
    the_other_user: {
      id: 'b0d1988f-b404-4402-8040-33f0201dc725',
      connection_type: 'member',
      integration_data: null,
      user_id: '8da5ebf9-39bf-45ae-b131-fa85e2d88101',
      user_image: null,
      user_type: 'organization_agent',
      user_public_key: '--PUBLIC_KEY--ABCD',
      user_keypair_external_id: '69074548-24cb-403d-828c-09af6002e1c4',
    },
  },
};

function mockVault(api) {
  api
    .post('/connections', {
      public_key: {
        public_key: '--PUBLIC_KEY--ABCD',
      },
      connection: {
        invitation_token: 'I2aUc0zEU2veqg52QtKbwEsJ1eNIqWlBdjH5FrRIKXg',
      },
    })
    .matchHeader('Authorization', '2FPN4n5T68xy78i6HHuQ')
    .matchHeader('Meeco-Subscription-Key', 'environment_subscription_key')
    .reply(200, response);
}
