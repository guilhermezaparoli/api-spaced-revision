import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';
  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: User) {
    return {
      accesstoken: this.JWTService.sign(
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
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.JWTService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.JWTService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
  async isEmailUserExists(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async login(email: string, password_hash: string, response: Response) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    if (!(await bcrypt.compare(password_hash, user.password_hash))) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    const token = this.createToken(user);
    response.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
      path: '/',
      sameSite: 'lax',
      domain: 'localhost',
      secure: false,
    });

    return { token };
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
  async register(data: AuthRegisterDTO, response: Response) {
    const emailInUse = await this.isEmailUserExists(data.email);
    if (emailInUse) {
      throw new ConflictException('Este e-mail já está em uso');
    }
    const user = await this.userService.create(data);
    const token = this.createToken(user);
    response.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
      path: '/',
      sameSite: 'lax',
      domain: 'localhost',
      secure: false,
    });
    console.log({ token });

    return response.json("Conta criada com sucesso!");

  }

  async logout(res: Response) {
    res.clearCookie('authToken', {
      path: '/',
    });

    return res.status(200).json('Logged out successfully');
  }
}
