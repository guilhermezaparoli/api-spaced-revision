import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UserTokenDTO } from 'src/user/dto/userToken.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(readonly prisma: PrismaService) {}

  async subjectExists(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: {
        id,
      },
    });

    if (!subject) {
      throw new NotFoundException('Essa matéria não existe!');
    }

    return subject;
  }
  async taskExists(id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('Essa tarefa não existe!');
    }

    return task;
  }

  async create(subject_id: string, data: CreateTaskDTO, user: UserTokenDTO) {
    const subject = await this.subjectExists(subject_id);
    console.log(subject.user_id, user.id);
    if (subject.user_id !== user.id) {
      throw new ForbiddenException('Essa matéria não pertence ao usuário');
    }

    await this.prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        subject_id,
      },
    });
  }

  // atualizar a verificação do usuário
  async update(id: string, data: UpdateTaskDTO) {
    const task = await this.taskExists(id);
    // console.log(subject.user_id, user.id);
    // if (task.user_id !== user.id) {
    //   throw new ForbiddenException('Essa matéria não pertence ao usuário');
    // }

    return await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
      select: {
        name: true,
        description: true,
      },
    });
  }

  // atualizar a verificação do usuário
  async delete(id: string) {
    const task = await this.taskExists(id);

     await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
