import { IsString } from "class-validator";

export class UserTokenDTO {
    @IsString()
    id: string

    @IsString()
    name: string
}