import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { AppModule } from './../src/app.module';
import { add } from 'date-fns';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        name: 'Test',
        url: faker.internet.url(),
        date: [add(new Date(), { days: 1 }), add(new Date(), { days: 2 })],
      })
      .expect(201)
      .expect({
        id: expect.any(String),
      });
  });
});
