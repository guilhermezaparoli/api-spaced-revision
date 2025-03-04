import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDTO } from './dto/create-subject.dto';
import { UserTokenDTO } from 'src/user/dto/userToken.dto';
import { UpdateSubjectDTO } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(readonly prisma: PrismaService) {}

  private async validateOwnership(id: string, userToken: UserTokenDTO) {
    const subject = await this.findSubjectById(id);
    if (subject.user_id !== userToken.id) {
      throw new ForbiddenException('Essa matéria não pertence ao usuário');
    }
    return subject;
  }

  async findSubjectById(id: string) {
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

  async create(data: CreateSubjectDTO, user: UserTokenDTO) {
    return await this.prisma.subject.create({
      data: {
        ...data,
        user_id: user.id,
      },
      select: {
        id: true,
        name: true,
        task: true,
        user_id: true,
      },
    });
  }

  async update(id: string, userToken: UserTokenDTO, {
    name
  }: UpdateSubjectDTO) {
    await this.validateOwnership(id, userToken);

   return await this.prisma.subject.update({
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
    await this.validateOwnership(id, userToken);

    await this.prisma.subject.delete({
      where: {
        id,
      },
    });
  }

  async getAll(userToken: UserTokenDTO) {
    return this.prisma.subject.findMany({
      where: {
        user_id: userToken.id,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        task: {
          orderBy: {
            created_at: 'asc',
          },
          select: {
            id: true,
            name: true,
            description: true,
            completed: true,
            review: {
              orderBy: {
                review_date: 'asc',
              },
            },
          },
        },
      },
    });
  }
}
