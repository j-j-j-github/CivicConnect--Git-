import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CitizensModule } from './citizens/citizens.module';
import { StorageModule } from './storage/storage.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { FeedbackModule } from './feedback/feedback.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';
import { DepartmentsModule } from './departments/departments.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, AuthModule, CitizensModule, StorageModule, ComplaintsModule, FeedbackModule, NotificationsModule, MailModule, DepartmentsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
