import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'apps/auth/src/models/user.schema';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (__data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
