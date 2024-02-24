import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function seed() {
  const permissions = [
    {
      name: 'apply_permission',
      content: 'permission',
      description: 'Permissão para aplicar permissões aos usuários',
    },
    {
      name: 'create_user',
      content: 'user',
      description: 'Permissão para criar usuário',
    },
    {
      name: 'edit_user',
      content: 'user',
      description: 'Permissão para editar usuário',
    },
    {
      name: 'delete_user',
      content: 'user',
      description: 'Permissão para deletar usuário',
    },
    {
      name: 'create_organization',
      content: 'organization',
      description: 'Permissão para criar uma organização',
    },
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

  const templates = [
    {
      body: "<div style='width: 100%;max-width: 600px;margin: 0 auto;padding: 20px;text-align:center;'><div style='margin-bottom: 20px;'><img style='max-width: 200px;height: auto;' src='https://evnts.com.br/wp-content/uploads/2021/08/logo-evnts-1-1.png' alt='Logo da Evnts'></div><div style=' background-color: #fff;padding: 20px;border-radius: 10px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'><h2>Recuperação de Senha</h2><p style= 'margin-bottom: 20px;'>Olá {{name}},</p><p style= 'margin-bottom: 20px;'>Você solicitou a recuperação de senha. Clique no botão abaixo para redefinir sua senha.</p><a href='{{link}}'style=' display: inline-block;background-color: #550098;color: #fff;text-decoration: none;padding: 10px 20px;border-radius: 5px;'>Redefinir Senha</a></div></div>",
      content: 'forgot_password',
      subject: 'Recuperação de senha',
    },
  ];

  for (const template of templates) {
    const { body, content, subject } = template;
    const templateExists = await prisma.template.findFirst({
      where: { content },
    });

    if (!templateExists) {
      await prisma.template.create({
        data: {
          body,
          content,
          subject,
        },
      });
    }

    console.log(`Template ${content} created`);
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
