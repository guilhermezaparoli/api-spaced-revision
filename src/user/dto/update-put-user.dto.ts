import { IsUUID } from "class-validator";
import { CreateUserDTO } from "./create-user.dto";

export class UpdatePutUserDTO extends CreateUserDTO {
    @IsUUID()
    id: string
     
}