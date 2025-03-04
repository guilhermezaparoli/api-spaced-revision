import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UserTokenDTO } from 'src/user/dto/userToken.dto';
import { UpdateTaskDTO } from './dto/path-task.dto';

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

    if (subject.user_id !== user.id) {
      throw new ForbiddenException('Essa matéria não pertence ao usuário');
    }

    const task = await this.prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        intervals: subject.intervals,
        subject_id,
      },
    });

    if (subject.intervals.length > 0) {
      const reviewsDate = subject.intervals.map((interval) => {
        const review_date = new Date(task.created_at);
        review_date.setDate(review_date.getDate() + interval);
        return {
          review_date,
          task_id: task.id,
        };
      });

      await this.prisma.review.createMany({
        data: reviewsDate,
      });
    }

    return await this.prisma.task.findUnique({
      where: {
        id: task.id,
      },
      select: {
        completed: true,
        description: true,
        subject_id: true,
        review: true,
        name: true,
        id: true,
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
        completed: true,
        review: true,
        id: true,
        subject_id: true,
      },
    });
  }

  // atualizar a verificação do usuário
  async delete(id: string) {
    await this.taskExists(id);

    await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
