import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const IsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userType = request.user.type;

    if (userType === 'PARTICIPANT') {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso.',
      );
    }

    return request.user;
  },
);
