import { Permission } from '@/modules/permissions/domain/permission';

interface UserPermissionsProps {
  id: string;
  name: string;
  content: string;
  description?: string;
}

export class UserPermissions {
  private _permissions: UserPermissionsProps[];

  constructor(permissions?: Permission[]) {
    if (!permissions) {
      this._permissions = [];
      return;
    }
    this._permissions = this.handlePermissions(permissions);
  }

  get permissions() {
    return this._permissions;
  }

  apply(permissions: Permission[]) {
    this._permissions = this._permissions.concat(
      this.handlePermissions(permissions),
    );
  }

  has(name: string) {
    return this._permissions.some((permission) => permission.name === name);
  }

  get value() {
    return this._permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      content: permission.content,
      description: permission.description,
    }));
  }

  private handlePermissions(permissions: Permission[]) {
    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      content: permission.content,
      description: permission.description,
    }));
  }
}
