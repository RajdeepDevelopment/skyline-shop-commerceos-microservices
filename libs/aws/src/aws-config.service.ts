import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { SNSClient, SNSClientConfig } from '@aws-sdk/client-sns';
import { SecretsManagerClient, SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager';
import { SSMClient, SSMClientConfig } from '@aws-sdk/client-ssm';
import { STSClient, STSClientConfig } from '@aws-sdk/client-sts';

export type AwsMode = 'floci' | 'aws';

export interface AwsClientOptions {
  /**
   * AWS region. Defaults to AWS_DEFAULT_REGION or us-east-1.
   */
  region?: string;
  /**
   * Explicit endpoint override (e.g. http://localhost:4566 for Floci).
   * When unset, SDK resolves real AWS endpoints unless AWS_ENDPOINT_URL
   * is set in the environment.
   */
  endpoint?: string;
}

/**
 * Central AWS configuration service.
 *
 * THE SWITCH: this service reads a handful of environment variables. Point the
 * same application at real AWS or at the local Floci emulator by changing only:
 *
 *   AWS_ENDPOINT_URL      -> http://localhost:4566  (Floci local)
 *                            <empty / unset>         (real AWS)
 *   AWS_ACCESS_KEY_ID     -> test                    (Floci local)
 *                            <real access key>       (real AWS)
 *   AWS_SECRET_ACCESS_KEY -> test                    (Floci local)
 *                            <real secret key>       (real AWS)
 *   AWS_DEFAULT_REGION    -> us-east-1               (either)
 *
 * No code changes needed — every client factory below picks up the mode from
 * these env vars automatically.
 */
@Injectable()
export class AwsConfigService {
  private readonly region: string;
  private readonly endpointUrl?: string;
  private readonly accessKeyId?: string;
  private readonly secretAccessKey?: string;

  constructor(private readonly config: ConfigService) {
    this.region = this.config.get<string>('AWS_DEFAULT_REGION') ?? 'us-east-1';
    this.endpointUrl = this.config.get<string>('AWS_ENDPOINT_URL') || undefined;
    this.accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID') || undefined;
    this.secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY') || undefined;
  }

  /**
   * Which AWS surface this process is talking to.
   *  - 'floci' when AWS_ENDPOINT_URL points at the local emulator (localhost:4566)
   *  - 'aws'   otherwise (real AWS endpoints)
   */
  get mode(): AwsMode {
    return this.endpointUrl?.includes('localhost') || this.endpointUrl?.includes('127.0.0.1')
      ? 'floci'
      : 'aws';
  }

  get isLocal(): boolean {
    return this.mode === 'floci';
  }

  get currentRegion(): string {
    return this.region;
  }

  /**
   * Endpoint to use for SDK clients. Returns the local Floci endpoint when in
   * floci mode; for real AWS it returns undefined so the SDK resolves real
   * regional endpoints automatically.
   */
  get endpoint(): string | undefined {
    return this.isLocal ? this.endpointUrl : undefined;
  }

  /**
   * Credentials: static test creds for Floci; for real AWS returns undefined
   * so the SDK falls back to the default provider chain (env vars, ~/.aws,
   * EKS/EC2 role, etc.).
   */
  get credentials(): { accessKeyId: string; secretAccessKey: string } | undefined {
    if (!this.isLocal) {
      return undefined;
    }
    return {
      accessKeyId: this.accessKeyId ?? 'test',
      secretAccessKey: this.secretAccessKey ?? 'test',
    };
  }

  private baseConfig(): {
    region: string;
    endpoint?: string;
    credentials?: unknown;
    forcePathStyle?: boolean;
  } {
    return {
      region: this.region,
      ...(this.endpoint ? { endpoint: this.endpoint } : {}),
      ...(this.credentials ? { credentials: this.credentials } : {}),
      forcePathStyle: this.isLocal,
    };
  }

  createS3Client(): S3Client {
    return new S3Client(this.baseConfig() as S3ClientConfig);
  }

  createSqsClient(): SQSClient {
    return new SQSClient(this.baseConfig() as SQSClientConfig);
  }

  createSnsClient(): SNSClient {
    return new SNSClient(this.baseConfig() as SNSClientConfig);
  }

  createSecretsManagerClient(): SecretsManagerClient {
    return new SecretsManagerClient(this.baseConfig() as SecretsManagerClientConfig);
  }

  createSsmClient(): SSMClient {
    return new SSMClient(this.baseConfig() as SSMClientConfig);
  }

  createStsClient(): STSClient {
    return new STSClient(this.baseConfig() as STSClientConfig);
  }
}
