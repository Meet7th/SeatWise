import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return res.status(400).json({
        code: 40001,
        data: null,
        message: firstError.message,
        details: { field: firstError.path.join('.') },
      });
    }
    req.body = result.data;
    next();
  };
}
