import { Live } from '@/modules/lives/domain/live';
import { faker } from '@faker-js/faker';

describe('Live', () => {
  it('Deve criar uma live', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      title: faker.word.sample(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };
    const live = new Live(params);

    expect(live).toBeDefined();
    expect(live.id).toBeDefined();
    expect(live.sessionId).toBe(params.sessionId);
    expect(live.eventId).toBe(params.eventId);
    expect(live.title).toBe(params.title);
    expect(live.link).toBe(params.link);
    expect(live.typeLink).toBe('YOUTUBE');
    expect(live.chat).toBeDefined();
    expect(live.enableTranslate).toBeFalsy();
    expect(live.chat.title).toBe(params.chat.title);
    expect(live.chat.type).toBe('open');
  });

  it('Deve desativar o chat da live', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      title: faker.word.sample(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };
    const live = new Live(params);
    live.disableChat();

    expect(live.disableChat).toBeTruthy();
  });

  it('Deve desativar as reacoes a live', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      title: faker.word.sample(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };
    const live = new Live(params);
    live.disableReactions();

    expect(live.disableReactions).toBeTruthy();
  });

  it('Deve ativar a traducao da live', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      title: faker.word.sample(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };
    const translation = {
      language: 'pt-BR',
      link: faker.internet.url(),
      text: faker.lorem.sentence(),
    };

    const live = new Live(params);
    live.addTranslation(
      translation.language,
      translation.text,
      translation.link,
    );

    expect(live.enableTranslate).toBeTruthy();
    expect(live.translation[0].text).toBe(translation.text);
    expect(live.translation[0].link).toBe(translation.link);
    expect(live.translation[0].language).toBe(translation.language);
  });

  it('Deve remover a traducao da live', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      title: faker.word.sample(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };
    const translation = {
      language: 'pt-BR',
      link: faker.internet.url(),
      text: faker.lorem.sentence(),
    };

    const live = new Live(params);
    live.addTranslation(
      translation.language,
      translation.text,
      translation.link,
    );

    live.removeTranslation(translation.language);

    expect(live.enableTranslate).toBeFalsy();
    expect(live.translation.length).toBe(0);
  });

  it('Deve finalizar a live', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      title: faker.word.sample(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };
    const live = new Live(params);
    live.finish();

    expect(live.finished).toBeTruthy();
    expect(live.finishedAt).toStrictEqual(expect.any(Date));
  });

  it('Deve retonar um erro ao tentar criar uma live com um tipo de link invalido', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      title: faker.word.sample(),
      link: faker.internet.url(),
      typeLink: 'INVALID',
      chat: {
        title: faker.word.sample(),
      },
    };

    expect(() => new Live(params)).toThrow('The type link is invalid');
  });

  it('Deve retonar um erro ao tentar criar uma live sem um link', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: faker.string.uuid(),
      link: '',
      title: faker.word.sample(),
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };

    expect(() => new Live(params)).toThrow('The link is required');
  });

  it('Deve retonar um erro ao tentar criar uma live o ID da sessao', () => {
    const params = {
      sessionId: '',
      eventId: faker.string.uuid(),
      link: faker.internet.url(),
      title: '',
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };

    expect(() => new Live(params)).toThrow('The session id is required');
  });

  it('Deve retonar um erro ao tentar criar uma live o ID do evento', () => {
    const params = {
      sessionId: faker.string.uuid(),
      eventId: '',
      link: faker.internet.url(),
      title: '',
      typeLink: 'YOUTUBE',
      chat: {
        title: faker.word.sample(),
      },
    };

    expect(() => new Live(params)).toThrow('The event id is required');
  });
});
