import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

function isDecimalLike(obj: any): boolean {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    's' in obj &&
    'e' in obj &&
    'd' in obj &&
    Object.keys(obj).length === 3 &&
    Array.isArray(obj.d)
  );
}

function decimalToNumber(obj: { s: number; e: number; d: number[] }): number {
  // Prisma Decimal: value = s * (d[0] + d[1]/1e7 + d[2]/1e14 + ...) * 10^e
  let mantissa = 0;
  let scale = 1;
  for (const chunk of obj.d) {
    mantissa += chunk / scale;
    scale *= 1e7;
  }
  return obj.s * mantissa * Math.pow(10, obj.e);
}

function serializeDecimal(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (isDecimalLike(obj)) {
    return decimalToNumber(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeDecimal);
  }

  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    result[key] = serializeDecimal(obj[key]);
  }
  return result;
}

@Injectable()
export class DecimalSerializationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => serializeDecimal(data)));
  }
}
