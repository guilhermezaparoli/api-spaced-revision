import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateSubjectDTO {
  @IsString()
  name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  intervals: number[];
}
