import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";

@Module({
    imports: [JwtModule.register({
        secret: "c4P,7KHJ`)&ff~7[#3b06/AbV^x3r*~?"
    }), UserModule, PrismaModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModel {}