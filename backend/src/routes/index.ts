import express from 'express';
import * as AuthController from '../controllers/AuthController';
import * as MessageController from '../controllers/MessageController';
import AuthMiddleware from '../middleware/AuthMiddleware';
import validate from '../middleware/BodyValidationMiddleware';
import { loginReqSchema, registerReqSchema, promptSchema } from './validationSchemas';
import MatchingUserIdMiddleware from '../middleware/MatchingIdMiddleware';

const routes = express.Router();

routes.post('/login', validate(loginReqSchema), AuthController.login);
routes.post('/register', validate(registerReqSchema), AuthController.register);
routes.post(
  '/prompt/:user_id',
  [validate(promptSchema), AuthMiddleware, MatchingUserIdMiddleware],
  MessageController.requestResponse
);
routes.get(
  '/messages/:user_id',
  [AuthMiddleware, MatchingUserIdMiddleware],
  MessageController.getMessages
);

export default routes;
