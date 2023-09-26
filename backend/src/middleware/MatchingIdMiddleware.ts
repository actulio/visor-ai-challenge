import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const MatchingUserIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: 'No token provided' });
  const user_id = req.params.user_id;
  if (!user_id) return res.status(401).send({ error: 'No user_id provided' });

  try {
    const [, token] = authHeader.split(' ');
    const decodedToken = jwt.decode(token) as { user_id: string };
    if (decodedToken.user_id !== user_id)
      return res.status(401).send({ error: 'User does not have permission to view this resource' });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).send();
  }
};

export default MatchingUserIdMiddleware;
