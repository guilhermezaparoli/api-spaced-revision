import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModel } from './auth/auth.module';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => AuthModel)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
