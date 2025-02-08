import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SubjectModule } from './subject/subject.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => TaskModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
