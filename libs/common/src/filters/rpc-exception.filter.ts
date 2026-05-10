import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

interface GrpcError {
  message?: string;
}

@Catch(RpcException)
export class CustomRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: RpcException, _host: ArgumentsHost): Observable<never> {
    const error = exception.getError() as string | GrpcError;
    const message = typeof error === 'string' ? error : (error.message ?? 'Internal server error');
    return throwError(() => ({
      code: status.INTERNAL,
      message,
    }));
  }
}
