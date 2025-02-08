import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsNumber({}, { each: true }) 
  intervals: number[];
}
