import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { EncryptionService } from '@app/common';

@Injectable()
export class EventBusService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   * Publish an event to NATS JetStream.
   */
  async publish(pattern: string, data: any): Promise<void> {
    this.natsClient.emit(pattern, data);
  }

  /**
   * Encrypt and publish an event.
   */
  async publishSecure(pattern: string, data: any): Promise<void> {
    const encryptedData = await this.encryptionService.encrypt(data);
    this.natsClient.emit(`${pattern}.encrypted`, { payload: encryptedData });
  }

  /**
   * Send a message and wait for a response.
   */
  async send<TResult = any, TInput = any>(pattern: string, data: TInput): Promise<TResult> {
    return firstValueFrom(this.natsClient.send<TResult, TInput>(pattern, data));
  }

  /**
   * Encrypt, send and decrypt response.
   */
  async sendSecure<TResult = any, TInput = any>(pattern: string, data: TInput): Promise<TResult> {
    const encryptedData = await this.encryptionService.encrypt(data);
    const response = await firstValueFrom(
      this.natsClient.send<{ payload: string }, { payload: string }>(`${pattern}.encrypted`, {
        payload: encryptedData,
      }),
    );

    return this.encryptionService.decrypt(response.payload);
  }
}
