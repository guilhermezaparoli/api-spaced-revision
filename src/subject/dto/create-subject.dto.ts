import { IsString } from "class-validator";

export class CreateSubjectDTO  {
    @IsString()
    name: string
    
    @IsString()
    user_id: string
}