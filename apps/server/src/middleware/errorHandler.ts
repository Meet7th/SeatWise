import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  code?: number;
  statusCode?: number;
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  // 区分应用已知错误和未知系统错误
  const statusCode = err.statusCode || 500;
  const isKnownError = err.code && err.code < 50000;

  if (!isKnownError) {
    console.error('[Error]', err.message);
    console.error(err.stack);
  }

  // 已知应用错误返回对应 code，未知错误始终返回通用消息
  res.status(isKnownError ? 400 : statusCode).json({
    code: err.code || 50000,
    data: null,
    message: isKnownError
      ? err.message
      : process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
  });
}
