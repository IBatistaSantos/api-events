import { SponsorBanner } from '@/modules/sponsors/banner/domain/sponsor-banner';

describe('SponsorBanner', () => {
  let sponsorBanner: SponsorBanner;

  beforeEach(() => {
    sponsorBanner = new SponsorBanner({
      url: 'https://example.com',
      desktop: 'desktop-image.jpg',
      mobile: 'mobile-image.jpg',
      tablet: 'tablet-image.jpg',
      eventId: '123',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  });

  it('Deve criar a config da banner dos patrocinadores', () => {
    expect(sponsorBanner).toBeDefined();
    expect(sponsorBanner.id).toBeDefined();
    expect(sponsorBanner.url).toBe('https://example.com');
    expect(sponsorBanner.desktop).toBe('desktop-image.jpg');
    expect(sponsorBanner.mobile).toBe('mobile-image.jpg');
    expect(sponsorBanner.tablet).toBe('tablet-image.jpg');
    expect(sponsorBanner.eventId).toBe('123');
    expect(sponsorBanner.status).toBe('ACTIVE');
    expect(sponsorBanner.createdAt).toBeInstanceOf(Date);
    expect(sponsorBanner.updatedAt).toBeInstanceOf(Date);
    expect(sponsorBanner.deletedAt).toBeNull();
  });

  describe('validate', () => {
    it('Deve retornar um erro ao criar a config da banner dos patrocinadores sem url', () => {
      expect(() => {
        sponsorBanner = new SponsorBanner({
          desktop: 'desktop-image.jpg',
          mobile: 'mobile-image.jpg',
          tablet: 'tablet-image.jpg',
          url: '',
          eventId: '123',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        });
      }).toThrow('A url é obrigatória');
    });

    it('Deve retornar um erro ao criar a config da banner dos patrocinadores sem eventId', () => {
      expect(() => {
        sponsorBanner = new SponsorBanner({
          url: 'https://example.com',
          desktop: 'desktop-image.jpg',
          eventId: '',
          mobile: 'mobile-image.jpg',
          tablet: 'tablet-image.jpg',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        });
      }).toThrow('O Id do evento é obrigatório');
    });
  });

  describe('update', () => {
    it('Deve atualizar a configuração da banner dos patrocinadores', () => {
      sponsorBanner.update({
        url: 'https://example.com.br',
        desktop: 'new-desktop-image.jpg',
        mobile: 'new-mobile-image.jpg',
        tablet: 'new-tablet-image.jpg',
      });

      expect(sponsorBanner.url).toBe('https://example.com.br');
      expect(sponsorBanner.desktop).toBe('new-desktop-image.jpg');
      expect(sponsorBanner.mobile).toBe('new-mobile-image.jpg');
      expect(sponsorBanner.tablet).toBe('new-tablet-image.jpg');
      expect(sponsorBanner.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('delete', () => {
    it('Deve desativar a configuração da banner dos patrocinadores', () => {
      sponsorBanner.delete();

      expect(sponsorBanner.status).toBe('INACTIVE');
      expect(sponsorBanner.deletedAt).toBeInstanceOf(Date);
    });
  });
});
