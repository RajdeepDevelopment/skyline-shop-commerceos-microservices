import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EncryptionService } from '../utils/encryption.service';

export const DecryptPayload = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
  const context = ctx.switchToRpc().getContext();

  const payload = ctx.switchToRpc().getData();

  // Check if the message is actually encrypted (contains a payload property)

  if (payload && payload.payload && typeof payload.payload === 'string') {
    // We need access to the EncryptionService.
    // Param decorators can't inject services directly easily.
    // So we expect the payload to be decrypted by an interceptor or handled manually.

    return payload.payload;
  }

  return payload;
});
