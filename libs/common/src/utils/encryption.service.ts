import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as openpgp from 'openpgp';

@Injectable()
export class EncryptionService {
  private publicKey: string;
  private privateKey: string;
  private passphrase?: string;

  constructor() {
    this.publicKey = (process.env.PGP_PUBLIC_KEY || '').replace(/\\n/g, '\n');
    this.privateKey = (process.env.PGP_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    this.passphrase = process.env.PGP_PASSPHRASE;
  }

  async encrypt(payload: any): Promise<string> {
    try {
      const message = await openpgp.createMessage({ text: JSON.stringify(payload) });
      const publicKey = await openpgp.readKey({ armoredKey: this.publicKey });

      const encrypted = await openpgp.encrypt({
        message,
        encryptionKeys: publicKey,
      });

      return encrypted as string;
    } catch (error) {
      console.error('PGP Encryption Error:', error);
      throw new InternalServerErrorException('Failed to encrypt message');
    }
  }

  async decrypt(encryptedMessage: string): Promise<any> {
    try {
      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: this.privateKey }),
        passphrase: this.passphrase,
      });

      const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });

      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
      });

      return JSON.parse(decrypted as string);
    } catch (error) {
      console.error('PGP Decryption Error:', error);
      throw new InternalServerErrorException('Failed to decrypt message');
    }
  }
}
