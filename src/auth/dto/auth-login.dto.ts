import { IsEmail, IsStrongPassword } from "class-validator";

export class AuthLoginDTO {

    @IsEmail()
    email: string

    @IsStrongPassword()
    password_hash: string
}