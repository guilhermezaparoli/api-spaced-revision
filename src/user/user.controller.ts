import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async create(@Body() { email, name, password_hash }: CreateUserDTO) {
    return this.userService.create({email, name, password_hash})
  }

  // @Put(':id')
  // async fullUpdate(
  //   @Body() { email, name, password_hash }: UpdatePutUserDTO,
  //   @Param('id') id,
  // ) {
  //   return {
  //     body: {
  //       email,
  //       name,
  //       password_hash,
  //     },
  //     id,
  //   };
  // }

  @UseGuards(AuthGuard)
  @Put(':id')
  async partialUpdate(
    @Body() {  name, password_hash, email }: UpdatePutUserDTO,
    @Param('id') id,
  ) {
    return this.userService.update({id, name, password_hash, email})
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    return { id };
  }
}
