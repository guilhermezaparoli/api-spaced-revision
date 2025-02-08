import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { User } from 'src/decorators/param-user.decorator';
import { UserTokenDTO } from 'src/user/dto/userToken.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(readonly taskService: TaskService) {}

  @Post(":id")
  async create(@Body() data: CreateTaskDTO, @Param("id") id: string, @User() user: UserTokenDTO) {
    return await this.taskService.create(id, data, user)
  }

  @Put(":id")
  async update(@Body() body: UpdateTaskDTO, @Param("id") id:string ){
    return await this.taskService.update(id, body)
  }

  @Delete(":id")
  async delete(@Param("id") id:string){

    return this.taskService.delete(id)
  }
}
