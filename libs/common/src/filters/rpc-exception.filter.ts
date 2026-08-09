import { Catch, RpcExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

interface GrpcError {
  message?: string;
  statusCode?: number;
}

@Catch(RpcException)
export class CustomRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, _host: ArgumentsHost): Observable<never> {
    const error = exception.getError() as string | GrpcError | HttpException;

    let grpcCode = status.INTERNAL;
    let message = 'Internal server error';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof HttpException) {
      const httpStatus = error.getStatus();
      grpcCode = this.httpToGrpcCode(httpStatus);
      const response = error.getResponse();
      message = typeof response === 'string' ? response : (response as any).message || message;
    } else if (error && typeof error === 'object') {
      message = error.message || 'Internal server error';
      if (error.statusCode) {
        grpcCode = this.httpToGrpcCode(error.statusCode);
      }
    }

    return throwError(() => ({
      code: grpcCode,
      message,
    }));
  }

  private httpToGrpcCode(httpStatus: number): number {
    switch (httpStatus) {
      case 400:
        return status.INVALID_ARGUMENT;
      case 401:
        return status.UNAUTHENTICATED;
      case 403:
        return status.PERMISSION_DENIED;
      case 404:
        return status.NOT_FOUND;
      case 409:
        return status.ALREADY_EXISTS;
      case 429:
        return status.RESOURCE_EXHAUSTED;
      case 499:
        return status.CANCELLED;
      case 500:
        return status.INTERNAL;
      case 501:
        return status.UNIMPLEMENTED;
      case 503:
        return status.UNAVAILABLE;
      default:
        return status.INTERNAL;
    }
  }
}
