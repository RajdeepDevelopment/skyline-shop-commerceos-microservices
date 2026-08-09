export class PrismaClient {
  $connect = jest.fn(async () => undefined);
  $disconnect = jest.fn(async () => undefined);
  $on = jest.fn();
  $use = jest.fn();
  $queryRaw = jest.fn(async () => []);
  $queryRawUnsafe = jest.fn(async () => []);
  $executeRaw = jest.fn(async () => 0);
  $executeRawUnsafe = jest.fn(async () => 0);
  $transaction = jest.fn(async <T>(fn?: (client: PrismaClient) => Promise<T>) =>
    typeof fn === 'function' ? fn(this) : [],
  );
}

export const $Enums = {};
export const ModelName = {};
export const Prisma = {
  ModelName: {},
  PrismaClientKnownRequestError: class extends Error {
    code: string;
    constructor(message: string, options: { code: string; meta?: unknown }) {
      super(message);
      this.code = options.code;
    }
  },
};
