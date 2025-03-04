import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/param-user.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userservice: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('login')
  async login(
    @Body() { email, password_hash }: AuthLoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {

 
    return this.authService.login(email, password_hash, response);
  }

  @Post('register')
  async register(@Body() data: AuthRegisterDTO) {
    return this.authService.register(data);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password_hash, token }: AuthResetDTO) {
    return this.authService.reset(password_hash, token);
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    return this.authService.logout(res)
  }

  // @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return {
      user,
    };
  }
}
