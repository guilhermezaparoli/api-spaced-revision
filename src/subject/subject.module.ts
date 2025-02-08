import { Module } from "@nestjs/common";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";

@Module({
    imports:[PrismaModule, AuthModule, UserModule],
    providers: [SubjectService],
    controllers: [SubjectController],
})
export class SubjectModule {}