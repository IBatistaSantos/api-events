import { SponsorBanner } from '@/modules/sponsors/banner/domain/sponsor-banner';
import { SponsorBannerRepository } from '@/modules/sponsors/banner/repository/sponsor-banner.repository';
import { SponsorBannerService } from '@/modules/sponsors/banner/services/sponsor-banner';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('SponsorBannerService', () => {
  let provider: SponsorBannerService;
  let repository: MockProxy<SponsorBannerRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SponsorBannerService,
          useClass: SponsorBannerService,
        },
        {
          provide: 'SponsorBannerRepository',
          useValue: (repository = mock<SponsorBannerRepository>()),
        },
      ],
    }).compile();
    repository.save.mockResolvedValue();
    repository.update.mockResolvedValue();
    provider = module.get<SponsorBannerService>(SponsorBannerService);
  });

  describe('create', () => {
    it('Deve criar um banner', async () => {
      const eventId = faker.string.uuid();
      const url = faker.internet.url();
      const response = await provider.create({
        url,
        desktop: 'desktop',
        mobile: 'mobile',
        tablet: 'tablet',
        eventId,
      });

      expect(response.id).toBeDefined();
      expect(response.url).toBe(url);
      expect(response.desktop).toBe('desktop');
      expect(response.mobile).toBe('mobile');
      expect(response.tablet).toBe('tablet');
      expect(response.eventId).toBe(eventId);
    });

    it('Deve retornar erro se já existir um banner para o evento', async () => {
      repository.findByEventId.mockResolvedValueOnce(
        new SponsorBanner({
          eventId: faker.string.uuid(),
          url: faker.internet.url(),
        }),
      );

      await expect(
        provider.create({
          url: 'url',
          desktop: 'desktop',
          mobile: 'mobile',
          tablet: 'tablet',
          eventId: 'eventId',
        }),
      ).rejects.toThrow('Já existe um banner para este evento');
    });
  });

  describe('update', () => {
    it('Deve atualizar um banner', async () => {
      const url = faker.internet.url();
      repository.findById.mockResolvedValueOnce(
        new SponsorBanner({
          id: faker.string.uuid(),
          url: faker.internet.url(),
          desktop: faker.internet.url(),
          mobile: faker.internet.url(),
          tablet: faker.internet.url(),
          eventId: faker.string.uuid(),
        }),
      );

      const response = await provider.update(faker.string.uuid(), {
        url,
        desktop: 'desktop',
        mobile: 'mobile',
        tablet: 'tablet',
      });

      expect(response.url).toBe(url);
    });

    it('Deve retornar erro se o banner não existir', async () => {
      repository.findById.mockResolvedValueOnce(null);

      await expect(
        provider.update(faker.string.uuid(), {
          url: 'url',
          desktop: 'desktop',
          mobile: 'mobile',
          tablet: 'tablet',
        }),
      ).rejects.toThrow('A configuração do banner não foi encontrada');
    });
  });

  describe('delete', () => {
    it('Deve deletar um banner', async () => {
      repository.findById.mockResolvedValueOnce(
        new SponsorBanner({
          id: faker.string.uuid(),
          url: faker.internet.url(),
          desktop: faker.internet.url(),
          mobile: faker.internet.url(),
          tablet: faker.internet.url(),
          eventId: faker.string.uuid(),
        }),
      );

      await provider.delete(faker.string.uuid());
      expect(repository.update).toHaveBeenCalled();
      expect(repository.update.mock.calls[0][0].status).toBe('INACTIVE');
    });

    it('Deve retornar erro se o banner não existir', async () => {
      repository.findById.mockResolvedValueOnce(null);

      await expect(provider.delete(faker.string.uuid())).rejects.toThrow(
        'A configuração do banner não foi encontrada',
      );
    });
  });

  describe('show', () => {
    it('Deve retornar um banner', async () => {
      repository.findByEventId.mockResolvedValueOnce(
        new SponsorBanner({
          id: faker.string.uuid(),
          url: faker.internet.url(),
          desktop: faker.internet.url(),
          mobile: faker.internet.url(),
          tablet: faker.internet.url(),
          eventId: faker.string.uuid(),
        }),
      );

      const response = await provider.show(faker.string.uuid());
      expect(response.id).toBeDefined();
      expect(response.url).toBeDefined();
      expect(response.desktop).toBeDefined();
      expect(response.mobile).toBeDefined();
      expect(response.tablet).toBeDefined();
      expect(response.eventId).toBeDefined();
    });

    it('Deve retornar erro se o banner não existir', async () => {
      repository.findByEventId.mockResolvedValueOnce(null);

      await expect(provider.show(faker.string.uuid())).rejects.toThrow(
        'Nenhum banner foi encontrado',
      );
    });
  });
});
