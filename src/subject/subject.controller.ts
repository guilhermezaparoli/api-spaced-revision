import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateSubjectDTO } from './dto/create-subject.dto';
import { SubjectService } from './subject.service';
import { UpdateSubjectDTO } from './dto/update-subject.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/param-user.decorator';
import { UserTokenDTO } from 'src/user/dto/userToken.dto';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('subject')
export class SubjectController {
  constructor(readonly subjectService: SubjectService) {}

  @Post('create')
  async create(@Body() body: CreateSubjectDTO, @User() user:UserTokenDTO) {
    return await this.subjectService.create(body, user);
  }

  @Put(':id')
  async update(
    @User() user: UserTokenDTO,
    @Body() body: UpdateSubjectDTO,
    @Param('id') id: string,
  ) {
    return await this.subjectService.update(id, user, body);
  }

  @Get()
  async getAll(@User() user: UserTokenDTO) {
    
    return await this.subjectService.getAll(user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() userToken: UserTokenDTO) {
    return await this.subjectService.delete(id, userToken);
  }
}
