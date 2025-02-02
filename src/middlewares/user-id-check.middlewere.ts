import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { isNumber } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (isNumber(Number(req.params.id))) {
      throw new BadRequestException('ID inválido');
    }

    next();
  }
}
