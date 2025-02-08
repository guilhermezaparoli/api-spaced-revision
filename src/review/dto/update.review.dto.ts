import { IsBoolean } from "class-validator";

export class UpdateReviewDTO {

    @IsBoolean()
    completed: boolean
}