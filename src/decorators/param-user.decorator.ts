import { createParamDecorator, NotFoundException } from '@nestjs/common';

export const User = createParamDecorator((filter: string, context) => {
  const request = context.switchToHttp().getRequest();
 
  if (request.user) {
    if (filter) {
      return request.user[filter];
    }
    return request.user;
  }

  throw new NotFoundException(
    'Usuário não encontrado no Request. Use o AuthGuard para obter o usuário',
  );
});
