import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

export interface RetryOptions {
  maxRetries: number;
  scalingDuration: number;
}

/**
 * Custom RxJS operator for handling retries with exponential backoff.
 * Useful for resilient gRPC inter-service calls.
 */
export function retryWithBackoff(options: RetryOptions) {
  const { maxRetries, scalingDuration } = options;

  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors: Observable<any>) =>
        errors.pipe(
          mergeMap((error, index) => {
            const retryAttempt = index + 1;
            if (retryAttempt > maxRetries) {
              return throwError(() => error);
            }
            console.log(
              `[Retry] Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`,
            );
            return timer(retryAttempt * scalingDuration);
          }),
        ),
      ),
    );
}
