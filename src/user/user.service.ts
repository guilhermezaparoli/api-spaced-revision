import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password_hash }: CreateUserDTO) {
    return await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    });
  }

  // @UseGuards(AuthGuard)
  async update({ id, name, password_hash }: UpdatePatchUserDTO) {
    await this.exists(id);

    return this.prisma.user.update({
      data: {
        name,
        password_hash,
      },
      where: {
        id,
      },
    });
  }

  async exists(id: string) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }

  async show(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
