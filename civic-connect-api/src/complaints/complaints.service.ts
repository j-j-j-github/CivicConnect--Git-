import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComplaintStatus } from '@prisma/client';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}
  async getMyComplaints(userId: string) {
    return this.prisma.complaint.findMany({
      where: { citizen_id: userId },
      orderBy: { created_at: 'desc' },
      include: { department: true, feedback: true },
    });
  }

  async createComplaint(userId: string, data: any) {
    const categoryName = data.category || 'General';
    let department = await this.prisma.department.findFirst({ where: { name: categoryName } });
    if (!department) {
      department = await this.prisma.department.create({
        data: { name: categoryName, description: `${categoryName} Department` },
      });
    }

    const complaint = await this.prisma.complaint.create({
      data: {
        title: data.title || 'Untitled Complaint',
        description: data.description,
        location_lat: data.latitude,
        location_lng: data.longitude,
        media_urls: data.media_urls || [],
        citizen_id: userId,
        department_id: department.id,
      },
    });

    await this.prisma.complaintStatusHistory.create({
      data: {
        complaintId: complaint.id,
        status: ComplaintStatus.PENDING,
        note: 'Complaint submitted by citizen',
        changedById: userId,
      }
    });

    return complaint;
  }

  async reopenComplaint(userId: string, complaintId: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    if (complaint.citizen_id !== userId) {
      throw new ForbiddenException('You can only reopen your own complaints');
    }

    if (complaint.status !== ComplaintStatus.RESOLVED) {
      throw new BadRequestException('Only resolved complaints can be reopened');
    }

    const updated = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: { status: ComplaintStatus.PENDING },
    });

    await this.prisma.complaintStatusHistory.create({
      data: {
        complaintId: complaint.id,
        status: ComplaintStatus.PENDING,
        note: 'Complaint reopened by citizen',
        changedById: userId,
      }
    });

    return updated;
  }

  async getComplaintHistory(userId: string, complaintId: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    if (complaint.citizen_id !== userId) {
      throw new ForbiddenException('You can only view history for your own complaints');
    }

    return this.prisma.complaintStatusHistory.findMany({
      where: { complaintId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
