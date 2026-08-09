import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  correlationId: string;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const correlationId = (req.headers[CORRELATION_ID_HEADER] as string) ?? 'N/A';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.message;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as { message?: string | string[]; error?: string };
        message = resp.message ?? message;
        error = resp.error ?? error;
      }
    } else if (this.isGrpcError(exception)) {
      const grpcStatus = (exception as any).code;
      status = this.grpcToHttpStatus(grpcStatus);
      message = (exception as any).message || 'Service error';
      error = this.grpcStatusToText(grpcStatus);
    } else if (exception instanceof AxiosError) {
      const downstreamStatus = exception.response?.status;
      if (downstreamStatus) {
        status = downstreamStatus;
        const data = exception.response?.data as { message?: string | string[]; error?: string };
        message = data?.message ?? exception.message;
        error = data?.error ?? 'Upstream Service Error';
      } else {
        message = 'Upstream service unavailable';
        error = 'Service Unavailable';
        status = HttpStatus.SERVICE_UNAVAILABLE;
      }
    }

    const body: ErrorResponse = {
      statusCode: status,
      message,
      error,
      correlationId,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    res.status(status).json(body);
  }

  private isGrpcError(exception: unknown): boolean {
    return (
      exception !== null &&
      typeof exception === 'object' &&
      'code' in exception &&
      typeof (exception as any).code === 'number'
    );
  }

  private grpcToHttpStatus(grpcCode: number): number {
    switch (grpcCode) {
      case 0:
        return 200; // OK
      case 1:
        return 499; // CANCELLED
      case 2:
        return 400; // UNKNOWN
      case 3:
        return 400; // INVALID_ARGUMENT
      case 4:
        return 504; // DEADLINE_EXCEEDED
      case 5:
        return 404; // NOT_FOUND
      case 6:
        return 409; // ALREADY_EXISTS
      case 7:
        return 403; // PERMISSION_DENIED
      case 8:
        return 429; // RESOURCE_EXHAUSTED
      case 9:
        return 400; // FAILED_PRECONDITION
      case 10:
        return 409; // ABORTED
      case 11:
        return 400; // OUT_OF_RANGE
      case 12:
        return 501; // UNIMPLEMENTED
      case 13:
        return 500; // INTERNAL
      case 14:
        return 503; // UNAVAILABLE
      case 15:
        return 500; // DATA_LOSS
      case 16:
        return 401; // UNAUTHENTICATED
      default:
        return 500;
    }
  }

  private grpcStatusToText(grpcCode: number): string {
    const codes: Record<number, string> = {
      0: 'OK',
      1: 'Cancelled',
      2: 'Unknown',
      3: 'Invalid Argument',
      4: 'Deadline Exceeded',
      5: 'Not Found',
      6: 'Already Exists',
      7: 'Permission Denied',
      8: 'Resource Exhausted',
      9: 'Failed Precondition',
      10: 'Aborted',
      11: 'Out of Range',
      12: 'Unimplemented',
      13: 'Internal',
      14: 'Unavailable',
      15: 'Data Loss',
      16: 'Unauthenticated',
    };
    return codes[grpcCode] || 'Internal Server Error';
  }
}
