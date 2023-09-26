import { Request, Response, NextFunction } from 'express';
import { ValidationError, Schema } from 'yup';

const BodyValidationMiddleware = (resourceSchema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resource = req.body;
    try {
      await resourceSchema.validate(resource);
      next();
    } catch (e: any) {
      res.status(400).json({ error: (e as ValidationError).errors.join(', ') });
    }
  };
};

export default BodyValidationMiddleware;
