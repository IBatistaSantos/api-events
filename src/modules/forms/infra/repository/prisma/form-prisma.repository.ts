import { FormRepository } from '@/modules/forms/application/repository/form.repository';
import { Form } from '@/modules/forms/domain/form';
import { User } from '@/modules/users/domain/user';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

@Injectable()
export class FormRepositoryPrisma implements FormRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id, status: 'ACTIVE' },
    });

    if (!user) return null;

    return new User({
      accountId: user.accountId,
      email: user.email,
      name: user.name,
      password: user.password,
      type: user.type,
      createdAt: user.createdAt,
      id: user.id,
      status: user.status,
      updatedAt: user.updatedAt,
    });
  }

  async findById(id: string): Promise<any> {
    const response = await this.prisma.form.findUnique({
      where: { id, status: 'ACTIVE' },
      include: {
        field: true,
      },
    });

    if (!response) return null;

    const fields = response.field.map((field) => {
      return {
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder,
        options: field.Options,
      };
    });

    return new Form({
      id: response.id,
      title: response.title,
      description: response.description,
      fields: fields as any,
      organizationId: response.organizationId,
      userId: response.userId,
      status: response.status,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    });
  }

  async save(form: Form): Promise<void> {
    await this.prisma.form.create({
      data: {
        id: form.id,
        title: form.title,
        description: form.description,
        organizationId: form.organizationId,
        userId: form.userId,
        status: form.status as UserStatus,
        field: {
          create: form.fields.map((field) => {
            return {
              label: field.label,
              placeholder: field.placeholder,
              entireLine: field.entireLine,
              id: field.id,
              type: field.type,
              Options: field.options as any,
            };
          }),
        },
      },
    });
  }

  async update(form: Form): Promise<void> {
    await this.prisma.form.update({
      where: { id: form.id },
      data: {
        title: form.title,
        description: form.description,
        status: form.status as UserStatus,
        field: {
          deleteMany: {},
          create: form.fields.map((field) => {
            return {
              label: field.label,
              placeholder: field.placeholder,
              entireLine: field.entireLine,
              id: field.id,
              type: field.type,
              Options: field.options as any,
            };
          }),
        },
      },
    });

    await this.prisma.field.deleteMany({
      where: { formId: form.id },
    });

    await this.prisma.field.createMany({
      data: form.fields.map((field) => {
        return {
          id: field.id,
          label: field.label,
          type: field.type,
          required: field.required,
          placeholder: field.placeholder,
          options: field.options.map((option) => {
            return {
              value: option.value,
              label: option.label,
              AdditionalField: {
                create: option.additionalFields
                  ? option.additionalFields.map((additionalField) => {
                      return {
                        id: additionalField.id,
                        label: additionalField.label,
                        type: additionalField.type,
                        required: additionalField.required,
                        placeholder: additionalField.placeholder,
                      };
                    })
                  : [],
              },
            };
          }),
          formId: form.id,
        };
      }),
    });
  }
}
