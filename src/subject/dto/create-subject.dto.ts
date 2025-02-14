import { IsString } from "class-validator";

export class CreateSubjectDTO  {
    @IsString()
    name: string

}