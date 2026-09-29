import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      departmentsCount,
      usersCount,
      totalComplaints,
      activeComplaints,
      resolvedComplaints
    ] = await Promise.all([
      this.prisma.department.count(),
      this.prisma.user.count(),
      this.prisma.complaint.count(),
      this.prisma.complaint.count({
        where: { status: { in: ['PENDING', 'VERIFIED'] } }
      }),
      this.prisma.complaint.count({
        where: { status: 'RESOLVED' }
      })
    ]);

    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedComplaints / totalComplaints) * 100) 
      : 0;

    const recentComplaints = await this.prisma.complaint.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        created_at: true,
        ai_category: true,
        citizen: { select: { email: true, citizenProfile: { select: { full_name: true } } } }
      }
    });

    const departments = await this.prisma.department.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            complaints: true,
            officers: true
          }
        },
        complaints: {
          select: { status: true }
        }
      }
    });

    const enrichedDepartments = departments.map(dept => {
      const active = dept.complaints.filter(c => c.status === 'PENDING' || c.status === 'VERIFIED').length;
      const resolved = dept.complaints.filter(c => c.status === 'RESOLVED').length;
      return {
        id: dept.id,
        name: dept.name,
        totalOfficers: dept._count.officers,
        totalComplaints: dept._count.complaints,
        activeComplaints: active,
        resolvedComplaints: resolved
      };
    });

    return {
      departmentsCount,
      usersCount,
      totalComplaints,
      activeComplaints,
      resolvedComplaints,
      resolutionRate,
      recentComplaints,
      departments: enrichedDepartments
    };
  }

  async messageDepartment(adminId: string, deptId: string, message: string) {
    const officers = await this.prisma.user.findMany({
      where: {
        department_id: deptId,
        role: 'OFFICER'
      },
      select: { id: true }
    });

    if (officers.length === 0) {
      return { success: true, count: 0, message: 'No officers found in this department.' };
    }

    const notifications = officers.map(officer => ({
      user_id: officer.id,
      message: `[Admin Broadcast]: ${message}`,
      is_read: false,
    }));

    await this.prisma.notification.createMany({
      data: notifications
    });

    return { success: true, count: officers.length };
  }

  async getOfficers() {
    return this.prisma.user.findMany({
      where: { role: 'OFFICER' },
      select: {
        id: true,
        email: true,
        full_name: true,
        created_at: true,
        department: { select: { id: true, name: true } },
        citizenProfile: { select: { full_name: true, phone: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async addOfficer(data: { email: string; full_name: string; department_id: string; password_hash?: string; password?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    
    // Support either direct password_hash or raw password
    const hashed = data.password ? await bcrypt.hash(data.password, 10) : data.password_hash;
    
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password_hash: hashed || await bcrypt.hash('officer123', 10), // default fallback
        role: 'OFFICER',
        full_name: data.full_name,
        department_id: data.department_id,
        citizenProfile: {
          create: {
            full_name: data.full_name,
          }
        }
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        department: { select: { id: true, name: true } }
      }
    });
    
    return user;
  }
}
