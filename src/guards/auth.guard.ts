import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const requestWithCookie = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;
    const tokenCookie = requestWithCookie?.cookies?.authToken?.accesstoken ?? null;

console.log(requestWithCookie)
    try {
      const data = this.authService.checkToken(tokenCookie);
 
      request.tokenPayload = data;

      request.user = await this.userService.show(data.id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
