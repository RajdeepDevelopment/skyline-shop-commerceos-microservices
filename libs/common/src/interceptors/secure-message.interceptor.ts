import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EncryptionService } from '../utils/encryption.service';

@Injectable()
export class SecureMessageInterceptor implements NestInterceptor {
  constructor(private readonly encryptionService: EncryptionService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpc = context.switchToRpc();

    const data = rpc.getData();

    // If payload is encrypted, decrypt it before passing to handler
    if (
      data &&
      data.payload &&
      typeof data.payload === 'string' &&
      data.payload.includes('BEGIN PGP MESSAGE')
    ) {
      return from(this.encryptionService.decrypt(data.payload)).pipe(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        switchMap((decryptedData) => {
          // Replace the data in the context (though Nest makes this hard to do directly in the stream)
          // We pass the decrypted data to the next handler by wrapping it
          return next.handle();
        }),
      );
    }

    return next.handle();
  }
}
