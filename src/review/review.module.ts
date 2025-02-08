import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { ReviewService } from "./review.service";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [PrismaModule, AuthModule, UserModule],
    controllers: [ReviewController],
    providers: [ReviewService]
})
export class ReviewModel {}