import { Organization } from '@/modules/organization/domain/organization';

export interface IUserOrganizations {
  id: string;
  name: string;
  description: string;
}

export class UserOrganizations {
  private _organizations: IUserOrganizations[] = [];

  constructor(organizations: Organization[]) {
    const userOrganizations = organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      description: organization.description,
    }));
    this._organizations.push(...userOrganizations);
  }

  get organizations() {
    return this._organizations;
  }

  public add(organizations: Organization[]): void {
    const userOrganizations = organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      description: organization.description,
    }));

    this._organizations.push(...userOrganizations);
  }

  public remove(organizationId: string): void {
    this._organizations = this._organizations.filter(
      (organization) => organization.id !== organizationId,
    );
  }

  public has(organizationId: string): boolean {
    return !!this._organizations.find(
      (organization) => organization.id === organizationId,
    );
  }
}
