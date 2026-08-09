import { ConfigService } from '@nestjs/config';
import { AwsConfigService, AwsMode } from './aws-config.service';

function createConfigService(values: Record<string, string>): ConfigService {
  return {
    get: (key: string) => values[key],
  } as unknown as ConfigService;
}

describe('AwsConfigService', () => {
  let service: AwsConfigService;

  const build = (values: Record<string, string>) =>
    new AwsConfigService(createConfigService(values));

  describe('mode detection (the switch)', () => {
    it.each<[Record<string, string>, AwsMode]>([
      [{ AWS_ENDPOINT_URL: 'http://localhost:4566' }, 'floci'],
      [{ AWS_ENDPOINT_URL: 'http://127.0.0.1:4566' }, 'floci'],
      [{ AWS_ENDPOINT_URL: '' }, 'aws'],
      [{}, 'aws'],
      [{ AWS_ENDPOINT_URL: 'https://sqs.us-east-1.amazonaws.com' }, 'aws'],
    ])('with %j -> %s', (values, expected) => {
      expect(build(values).mode).toBe(expected);
    });
  });

  describe('endpoint', () => {
    it('returns the emulator endpoint in floci mode', () => {
      expect(build({ AWS_ENDPOINT_URL: 'http://localhost:4566' }).endpoint).toBe(
        'http://localhost:4566',
      );
    });

    it('returns undefined for real AWS so SDKs resolve real endpoints', () => {
      expect(build({ AWS_ENDPOINT_URL: '' }).endpoint).toBeUndefined();
      expect(build({}).endpoint).toBeUndefined();
    });
  });

  describe('credentials', () => {
    it('returns static test creds in floci mode (defaults to test/test)', () => {
      expect(build({ AWS_ENDPOINT_URL: 'http://localhost:4566' }).credentials).toEqual({
        accessKeyId: 'test',
        secretAccessKey: 'test',
      });
    });

    it('returns undefined for real AWS so the default provider chain applies', () => {
      expect(build({ AWS_ENDPOINT_URL: '' }).credentials).toBeUndefined();
    });
  });

  describe('region', () => {
    it('defaults to us-east-1', () => {
      expect(build({}).currentRegion).toBe('us-east-1');
    });

    it('uses AWS_DEFAULT_REGION when provided', () => {
      expect(build({ AWS_DEFAULT_REGION: 'eu-west-1' }).currentRegion).toBe('eu-west-1');
    });
  });

  describe('client factories', () => {
    it('creates SDK clients without throwing', () => {
      service = build({ AWS_ENDPOINT_URL: 'http://localhost:4566' });
      expect(service.createS3Client()).toBeDefined();
      expect(service.createSqsClient()).toBeDefined();
      expect(service.createSnsClient()).toBeDefined();
      expect(service.createSecretsManagerClient()).toBeDefined();
      expect(service.createSsmClient()).toBeDefined();
      expect(service.createStsClient()).toBeDefined();
    });
  });
});
