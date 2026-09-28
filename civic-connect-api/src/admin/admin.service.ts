import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [departmentsCount, usersCount, complaintsCount] = await Promise.all([
      this.prisma.department.count(),
      this.prisma.user.count(),
      this.prisma.complaint.count(),
    ]);

    return {
      departmentsCount,
      usersCount,
      complaintsCount,
    };
  }
}
