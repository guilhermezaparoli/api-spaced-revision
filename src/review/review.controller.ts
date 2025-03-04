import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewService } from './review.service';
import { UpdateReviewDTO } from './dto/update.review.dto';
import { AuthGuard } from 'src/guards/auth.guard';


@UseGuards(AuthGuard)
@Controller("review")
export class ReviewController {
  constructor(readonly reviewService: ReviewService) {}

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateReviewDTO) {
    return this.reviewService.update(id, data)
  }

}
