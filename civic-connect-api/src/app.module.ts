import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { ComplaintsModule } from './complaints/complaints.module';

@Module({
  imports: [PrismaModule, AuthModule, DepartmentsModule, ComplaintsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
