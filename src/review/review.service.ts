import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateReviewDTO } from './dto/update.review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async reviewExistsById(id: string) {
    const review = this.prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException('Revisão não encontrada!');
    }

    return review;
  }

  async allReviewCompleted(review) {
    const allCompleted =
      (await this.prisma.review.count({
        where: {
          task_id: review?.task_id,
          completed: false,
        },
      })) === 0;

    return await this.prisma.task.update({
      where: {
        id: review?.task_id,
      },
      data: {
        completed: allCompleted,
      },
    });
  }

  async update(id: string, data: UpdateReviewDTO) {
    const review = await this.reviewExistsById(id);

    const review_date = review?.review_date;

    if (data.completed) {
      await this.prisma.review.updateMany({
        where: {
          review_date: {
            lt: review_date,
          },
        },
        data,
      });
    }

    await this.prisma.review.updateMany({
      where: {
        review_date: {
          gt: review_date,
        },
      },
      data: {
        completed: false,
      },
    });

    await this.prisma.review.update({
      where: {
        id,
      },
      data,
    });

    return await this.allReviewCompleted(review);
  }
}
