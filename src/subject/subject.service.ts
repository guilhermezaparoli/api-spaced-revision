import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Subject } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDTO } from './dto/create-subject.dto';
import { User } from 'src/decorators/param-user.decorator';
import { UserTokenDTO } from 'src/user/dto/userToken.dto';

@Injectable()
export class SubjectService {
  constructor(readonly prisma: PrismaService) {}

  async create(data: CreateSubjectDTO) {
    return await this.prisma.subject.create({
      data,
      select: {
        id: true,
        name: true,
      },
    });
  }

  async subjectExist(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: {
        id,
      },
    });

    if (!subject) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }

    return subject;
  }

  async update(id: string, userToken: UserTokenDTO, name: string) {
    const subject = await this.subjectExist(id);

    if (subject.user_id !== userToken.id) {
      throw new ForbiddenException('Essa matéria não pertence ao usuário');
    }

    await this.prisma.subject.update({
      where: {
        id,
        user_id: userToken.id,
      },
      data: {
        name,
      },
    });
  }

  async delete(id: string, userToken: UserTokenDTO) {
    const subject = await this.subjectExist(id);

    if (subject.user_id !== userToken.id) {
      throw new ForbiddenException('Essa matéria não pertence ao usuário');
    }

    await this.prisma.subject.delete({
      where: {
        id,
      },
    });
  }
}
