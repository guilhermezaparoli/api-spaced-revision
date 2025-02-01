import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";

@Controller("users")
export class UserController {

    @Post()
    async create(@Body() body) {
        return {body}
    }

    @Get()
    async read() {
        return {
            users: []
        }
    }

    @Get(":id")
    async readOne(@Param() params) {
        return {
            user: {}, params
        }
    }

    @Put(":id")
    async fullUpdate(@Body() body, @Param() params){
        return {body, params}
    }
    @Patch(":id")
    async partialUpdate(@Body() body,@Param() params){
        return {body, params}
    }

    @Delete(":id")
    async delete(@Param() params){
        return { params}
    }
}