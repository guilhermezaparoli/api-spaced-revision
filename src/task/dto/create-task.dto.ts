import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  




}
