import { connectDatabase, disconnectDatabase } from '../config/database';
import express, { Express } from 'express';
import jwt from 'jsonwebtoken';
import routes from '../routes';
import request from 'supertest';
import { UserBuilder } from '../util/builders/user.builder';
import AuthService from '../services/AuthService';
import { User } from '../interfaces/IAuthService';
import { UserModel } from '../models/user';
import { MessageModel } from '../models/message';
import MessageService from '../services/MessageService';

jest.mock('openai');

process.env.JWT_SECRET = 'secret';
process.env.CRYPTO_PASSWORD = 'password';

const configureServer = (server: Express) => {
  connectDatabase();
  server.use(express.json());
  server.use(routes);
  // server.listen(3003, () => {});
};

const createFixtureUser = async (user: User) => {
  const authService = new AuthService();
  return await authService.register(user.email, user.name, user.password);
};

const createFixtureMessage = async (userId: string) => {
  const messageService = new MessageService();
  return await messageService.saveMessage('message', userId, false);
};

const sign = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!);
};

describe('E2E tests', () => {
  const app = express();
  configureServer(app);

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await MessageModel.deleteMany({});
  });
  const user = new UserBuilder().withEmail().withName().withPassword().build();

  describe('/login', () => {
    beforeAll(async () => {});

    describe('success', () => {
      it('should return a valid jwt', async () => {
        const created = await createFixtureUser(user);
        const res = await request(app)
          .post('/login')
          .send({ email: user.email, password: user.password });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
      });
    });
    describe('failure', () => {
      it('should return 400 if missing a required field', async () => {
        const res = await request(app).post('/login');
        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchObject({ error: 'password is a required field' });
      });

      it('should fail if password is incorrect', async () => {
        await createFixtureUser(user);
        const res = await request(app)
          .post('/login')
          .send({ email: user.email, password: 'incorrectPassword' });
        expect(res.statusCode).toBe(401);
        expect(res.body).toMatchObject({ error: 'Incorrect email or password' });
      });
    });
  });

  describe('/register', () => {
    describe('success', () => {
      it('should register a new user', async () => {
        const newUser = new UserBuilder().withName().withPassword().withRandomEmail().build();
        const res = await request(app).post('/register').send(newUser);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toMatchObject({ id: expect.any(String), email: newUser.email });
      });
    });
    describe('failure', () => {
      it('should fail if a required field is missing', async () => {
        const res = await request(app).post('/register').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toMatchObject({ error: 'password is a required field' });
      });
      it('should fail if email already exists', async () => {
        const user = new UserBuilder().withEmail().withName().withPassword().build();
        const authService = new AuthService();
        await authService.register(user.email, user.name, user.password);

        const res = await request(app).post('/register').send(user);
        expect(res.statusCode).toEqual(401);
        expect(res.body).toMatchObject({ error: 'Email already in use' });
      });
    });
  });

  describe('/prompt/:user_id', () => {
    describe('success', () => {
      it('should get response from prompt', async () => {
        const chatResponse = 'some response';
        jest
          .spyOn(MessageService.prototype, 'requestResponseFromPrompt')
          .mockReturnValue(Promise.resolve(chatResponse));
        const created = await createFixtureUser(user);

        const res = await request(app)
          .post(`/prompt/${created.id}`)
          .send({ prompt: 'alo' })
          .set('Authorization', `Bearer ${sign({ user_id: created.id })}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({ response: chatResponse });
      });
    });
    describe('failure', () => {
      it('should fail if a required field is missing', async () => {
        const res = await request(app).post('/prompt/123');
        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchObject({ error: 'prompt is a required field' });
      });
      it('should fail if jwt does not match user_id route param', async () => {
        const created = await createFixtureUser(user);

        const res = await request(app)
          .post(`/prompt/${created.id}`)
          .send({ prompt: 'Hello' })
          .set('Authorization', `Bearer ${sign({ user_id: 'invalidId' })}`);
        expect(res.statusCode).toBe(401);
        expect(res.body).toMatchObject({
          error: 'User does not have permission to view this resource',
        });
      });
    });
  });

  describe('/messages/:user_id', () => {
    describe('success', () => {
      it('should get messages from a user', async () => {
        const created = await createFixtureUser(user);
        await createFixtureMessage(created.id);
        await createFixtureMessage(created.id);
        await createFixtureMessage(created.id);

        const res = await request(app)
          .get(`/messages/${created.id}`)
          .set('Authorization', `Bearer ${sign({ user_id: created.id })}`);

        expect(res.statusCode).toBe(200);
        console.log(res.body);
        expect(res.body.total).toBe(3);
        expect(res.body.messages).toHaveLength(3);
      });
    });
    describe('failure', () => {
      it('should fail if jwt does not match user_id route param', async () => {
        const created = await createFixtureUser(user);

        const res = await request(app)
          .get(`/messages/${created.id}`)
          .send({ prompt: 'alo' })
          .set('Authorization', `Bearer ${sign({ user_id: 'invalidId' })}`);
        expect(res.statusCode).toBe(401);
        expect(res.body).toMatchObject({
          error: 'User does not have permission to view this resource',
        });
      });
    });
  });
});
