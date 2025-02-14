import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcryp from 'bcrypt';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password_hash }: CreateUserDTO) {
    const salt = await bcryp.genSalt();

    password_hash = await bcryp.hash(password_hash, salt);

    return await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    });
  }


  async update({ id, name, password_hash, email }: UpdatePutUserDTO) {
    await this.exists(id);

   const salt = await bcryp.genSalt();

    password_hash = await bcryp.hash(password_hash, salt);

    return this.prisma.user.update({
      data: {
        name,
        password_hash,
      },
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
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
