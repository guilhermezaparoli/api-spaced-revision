import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() { email, name, password }: CreateUserDTO) {
    return {
      email,
      name,
      password,
    };
  }

  @Get()
  async read() {
    return {
      users: [],
    };
  }

  @Get(':id')
  async readOne(@Param() params) {
    return {
      user: {},
      params,
    };
  }

  @Put(':id')
  async fullUpdate(
    @Body() { email, name, password }: UpdatePutUserDTO,
    @Param() params,
  ) {
    return {
      body: {
        email,
        name,
        password,
      },
      params,
    };
  }
  @Patch(':id')
  async partialUpdate(
    @Body() { email, name, password }: UpdatePatchUserDTO,
    @Param() params,
  ) {
    return { body: email, name, password, params };
  }

  @Delete(':id')
  async delete(@Param() params) {
    return { params };
  }
}
