import { IsJWT, IsStrongPassword } from 'class-validator';

export class AuthResetDTO {
  @IsStrongPassword()
  password_hash: string;

  @IsJWT()
  token: string;
}
