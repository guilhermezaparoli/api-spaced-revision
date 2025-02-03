import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User) {
    return {
      "accesstoken": this.JWTService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '12h',
          subject: user.id,
          issuer: 'login',
          audience: 'users',
        },
      )
    }
  }

  async checkToken(token: string) {
    // return this.JWTService.verify()
  }

  async login(email: string, password_hash: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password_hash,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }
    return this.createToken(user);
  }
  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail está incorreto!');
    }

    return true;
  }
  async reset(password_hash: string, token: string) {
    const id = '1231';
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password_hash,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }
}
