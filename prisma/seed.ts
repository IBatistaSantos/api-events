import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function seed() {
  const permissions = [
    {
      name: 'delete_organization',
      content: 'organization',
      description: 'Permissão para deletar a organização',
    },
    {
      name: 'edit_organization',
      content: 'organization',
      description: 'Permissão para editar a organização',
    },
    {
      name: 'create_campaign',
      content: 'campaign',
      description: 'Permissão para criar campanha',
    },
    {
      name: 'edit_campaign',
      content: 'campaign',
      description: 'Permissão para editar a campanha',
    },
    {
      name: 'delete_campaign',
      content: 'campaign',
      description: 'Permissão para deletar a campanha',
    },
    {
      name: 'create_event',
      content: 'event',
      description: 'Permissão para criar o evento',
    },
    {
      name: 'edit_event',
      content: 'event',
      description: 'Permissão para editar o evento',
    },
    {
      name: 'delete_event',
      content: 'event',
      description: 'Permissão para deletar o evento',
    },
    {
      name: 'create_certificate',
      content: 'certificate',
      description: 'Permissão para criar o certificado',
    },
    {
      name: 'edit_certificate',
      content: 'certificate',
      description: 'Permissão para editar o certificado',
    },
    {
      name: 'edit_lobby',
      content: 'lobby',
      description: 'Permissão para editar o lobby',
    },
    {
      name: 'edit_check_in',
      content: 'checkIn',
      description: 'Permissão para editar o check-in',
    },
    {
      name: 'edit_video_library',
      content: 'videoLibrary',
      description: 'Permissão para editar a biblioteca de vídeos',
    },
  ];

  for (const permission of permissions) {
    const { name, content, description } = permission;
    const permissionExists = await prisma.permissions.findUnique({
      where: { name },
    });

    if (!permissionExists) {
      await prisma.permissions.create({
        data: {
          name,
          content,
          description,
        },
      });
    }

    console.log(`Permission ${name} created`);
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
