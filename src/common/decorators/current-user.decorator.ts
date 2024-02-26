import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getCurrentUserByContext = (context: ExecutionContext): any => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return getCurrentUserByContext(context);
  },
);
