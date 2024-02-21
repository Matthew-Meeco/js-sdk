import { DidDocumentDto, OptionsDto } from '@meeco/identity-network-api-sdk';
import {
  DIDRequestHandler,
  DIDResultDto,
  DidDto,
} from '../../util/did-management/did-action-handler';
import { IKeyPairDID } from './key-pair-did';

export enum SupportedDidMethod {
  KEY = 'key',
  WEB = 'web',
  INDY = 'indy',
}

export enum SupportedNetwork {
  DANUBE = 'danube',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export enum SupportedDidDocumentOperation {
  SET_DID_DOCUMENT = 'setDidDocument',
}

export abstract class DIDBase {
  abstract keyPair: IKeyPairDID;

  constructor(
    public method: string,
    public didDocument: DidDocumentDto,
    public options: OptionsDto
  ) {
    this.method = method;
    this.options = options;
    this.didDocument = didDocument;
  }

  abstract getHandlerChain<TypeDIDResultDto extends DIDResultDto, TypeDidDto extends DidDto>():
    | DIDRequestHandler<TypeDIDResultDto, TypeDidDto>
    | undefined;
}
