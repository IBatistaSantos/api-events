import { randomUUID } from 'crypto';
import { IUserTypeValues, UserType } from './value-object/user-type';
import { Email } from './value-object/email';
import { Status } from '@/shared/domain/value-object/status';
import { Permission } from '@/modules/permissions/domain/permission';
import { UserPermissions } from './value-object/user-permissions';
import { Organization } from '@/modules/organization/domain/organization';
import { UserOrganizations } from './value-object/user-organizations';
import {
  BadException,
  UnauthorizedException,
} from '@/shared/domain/errors/errors';

interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  type: string;
  accountId: string;
  organizations?: Organization[];
  permissions?: Permission[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private _id: string;
  private _name: string;
  private _email: Email;
  private _password: string;
  private _type: UserType;
  private _accountId: string;
  private _permissions: UserPermissions;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _organizations: UserOrganizations;

  constructor(props: UserProps) {
    this._id = props.id || randomUUID();
    this._name = props.name;
    this._email = new Email(props.email);
    this._password = props.password;
    this._type = new UserType(props.type);
    this._accountId = props.accountId;
    this._status = new Status(props.status);
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._permissions = new UserPermissions(props.permissions);
    this._organizations = new UserOrganizations(props.organizations ?? []);

    this.validate();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get organizations() {
    return this._organizations?.organizations;
  }

  get email() {
    return this._email.value;
  }

  get accountId() {
    return this._accountId;
  }

  get password() {
    return this._password;
  }

  get status() {
    return this._status.value;
  }

  get type() {
    return this._type.value;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get permissions() {
    return this._permissions.value;
  }

  can(name: string) {
    if (this._type.isMaster()) return true;
    return this._permissions.has(name);
  }

  isMaster() {
    return this._type.isMaster();
  }

  applyPermission(admin: User, permission: Permission[]) {
    const isSameAccount = admin.accountId === this.accountId;
    if (!isSameAccount) {
      throw new UnauthorizedException('Not authorized');
    }

    const hasPermission = admin.type === 'ADMIN' || admin.type === 'MASTER';
    if (!hasPermission) {
      throw new UnauthorizedException('Not authorized');
    }

    const adminIsMaster = admin.type === 'MASTER';
    if (adminIsMaster) {
      this._permissions.apply(permission);
      return;
    }
    const isAdmin = admin.type === 'ADMIN';

    const hasPermissionApplyPermission = admin.permissions.find(
      (permission) => permission.name === 'apply-permission',
    );

    if (!hasPermissionApplyPermission) {
      throw new UnauthorizedException('Not authorized');
    }

    if (isAdmin && this.type === 'MASTER') {
      throw new UnauthorizedException('Not applied permission for user master');
    }

    this._permissions.apply(permission);
  }

  hasOrganization(organizationId: string) {
    if (!this.organizations || !this.organizations.length) return false;
    return this._organizations.has(organizationId);
  }

  addOrganizations(organizations: Organization[], admin: User) {
    const isMaster = this._type.isMaster();
    if (isMaster) throw new BadException('User is master');

    const isAdminMater = admin.isMaster();
    if (!isAdminMater) {
      const hasSameOrganization = organizations.every((organization) => {
        return admin.hasOrganization(organization.id);
      });
      if (!hasSameOrganization) {
        throw new UnauthorizedException('Not authorized');
      }
    }

    const isSameAccount = organizations.every(
      (organization) => organization.accountId === admin.accountId,
    );

    if (!isSameAccount) {
      throw new UnauthorizedException('Organization is not same account');
    }

    const isActive = organizations.every(
      (organization) => organization.isActive,
    );

    if (!isActive) {
      throw new UnauthorizedException('Organization is not active');
    }
    this._organizations.add(organizations);
  }

  removeOrganization(organizationId: string) {
    this._organizations.remove(organizationId);
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  changeEmail(email: string) {
    this._email = new Email(email);
    this.validate();
  }

  changePassword(password: string) {
    this._password = password;
    this.validate();
  }

  changeType(type: keyof IUserTypeValues) {
    this._type = new UserType(type);
    this.validate();
  }

  deactivate() {
    this._status.deactivate();
  }

  activate() {
    this._status.activate();
  }

  isActive() {
    return this._status.isActive();
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email.value,
      type: this._type.value,
      status: this._status.value,
      permissions: this._permissions.value,
      accountId: this._accountId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  private validate() {
    if (!this._name) {
      throw new BadException('Name is required');
    }

    if (this.name.split(' ').length === 1) {
      throw new BadException('Name must have first and last name');
    }

    if (!this._email) throw new BadException('Email is required');
    if (!this._password) throw new BadException('Password is required');
    if (!this._type) throw new BadException('Type is required');
    if (!this._accountId) throw new BadException('Account id is required');
  }
}
