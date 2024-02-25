import { MailProvider } from '@/modules/notifications/application/providers/mail.provider';
import { NotificationRepository } from '@/modules/notifications/application/repository/notification.repository';
import { SendMailUseCase } from '@/modules/notifications/application/useCases/send-mail.usecase';
import { Template } from '@/modules/notifications/domain/template';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('SendMailUseCase', () => {
  let sendMailUseCase: SendMailUseCase;
  let mailProvider: MockProxy<MailProvider>;
  let notificationRepository: MockProxy<NotificationRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMailUseCase,
        {
          provide: 'MailProvider',
          useValue: (mailProvider = mock<MailProvider>()),
        },
        {
          provide: 'NotificationRepository',
          useValue: (notificationRepository = mock<NotificationRepository>()),
        },
      ],
    }).compile();

    mailProvider.send.mockResolvedValue('messageId');
    notificationRepository.findByContext.mockResolvedValue(
      new Template({
        body: `Olá, {{name}}!`,
        context: 'FORGOT_PASSWORD',
        subject: 'Recuperação de senha',
      }),
    );
    sendMailUseCase = module.get<SendMailUseCase>(SendMailUseCase);
  });

  it('Deve enviar um email', async () => {
    const name = faker.person.fullName();
    await sendMailUseCase.execute({
      context: 'FORGOT_PASSWORD',
      to: {
        email: faker.internet.email(),
        name,
      },
      variables: {
        name,
      },
    });

    expect(mailProvider.send).toHaveBeenCalledTimes(1);
    expect(mailProvider.send).toHaveBeenCalledWith({
      to: {
        email: expect.any(String),
        name,
      },
      subject: 'Recuperação de senha',
      body: `Olá, ${name}!`,
    });
    expect(notificationRepository.save).toHaveBeenCalledTimes(1);
    expect(notificationRepository.save).toHaveBeenCalledWith({
      messageId: 'messageId',
      context: 'FORGOT_PASSWORD',
      to: expect.any(String),
      templateId: expect.any(String),
    });
  });

  it('Deve lançar um erro caso o template não seja encontrado', async () => {
    notificationRepository.findByContext.mockResolvedValue(null);
    await expect(
      sendMailUseCase.execute({
        context: 'FORGOT_PASSWORD',
        to: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      }),
    ).rejects.toThrow('Template nao encontrado');
  });
});
