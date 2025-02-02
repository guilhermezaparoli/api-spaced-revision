import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async createToken() {
    // return this.JWTService.sign({})
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
    return user;
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
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password_hash,
      },
    });

    return true;
  }
}
