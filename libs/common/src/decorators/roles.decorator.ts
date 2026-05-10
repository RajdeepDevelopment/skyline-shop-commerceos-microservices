import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  GUEST = 'guest',
}

export const ROLES_KEY = 'roles';

/**
 * Decorator to restrict a route to certain roles.
 * Usage: @Roles(Role.ADMIN, Role.MANAGER)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
