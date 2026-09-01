import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { AssignOfficerDto } from './dto/assign-officer.dto';
import { ReassignDepartmentDto } from './dto/reassign-department.dto';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createComplaintDto: CreateComplaintDto) {
    return this.prisma.complaint.create({
      data: {
        title: createComplaintDto.title,
        description: createComplaintDto.description,
        priority: createComplaintDto.priority || 'LOW',
        location_lat: createComplaintDto.location_lat,
        location_lng: createComplaintDto.location_lng,
        media_urls: createComplaintDto.media_urls || [],
        citizen_id: userId,
        department_id: createComplaintDto.department_id,
      },
    });
  }

  async findAll(userId: string, role: string, departmentId?: string) {
    if (role === 'ADMIN') {
      return this.prisma.complaint.findMany({
        include: {
          citizen: {
            select: { 
              id: true, 
              email: true, 
              citizenProfile: {
                select: { full_name: true }
              }
            }
          },
          department: true,
          assigned_officer: {
            select: { id: true, email: true }
          },
          _count: {
            select: { internal_notes: true }
          }
        },
        orderBy: { created_at: 'desc' }
      });
    }

    if (role === 'OFFICER') {
      if (!departmentId) return [];
      return this.prisma.complaint.findMany({
        where: { department_id: departmentId },
        include: {
          citizen: {
            select: { 
              id: true, 
              email: true, 
              citizenProfile: {
                select: { full_name: true }
              }
            }
          },
          department: true,
          assigned_officer: {
            select: { id: true, email: true }
          },
          _count: {
            select: { internal_notes: true }
          }
        },
        orderBy: { created_at: 'desc' }
      });
    }

    // Citizen
    return this.prisma.complaint.findMany({
      where: { citizen_id: userId },
      include: {
        department: true,
        assigned_officer: {
          select: { id: true, email: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findOne(id: string, userId: string, role: string, departmentId?: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        citizen: {
          select: { 
            id: true, 
            email: true, 
            citizenProfile: {
              select: { full_name: true }
            }
          }
        },
        department: true,
        assigned_officer: {
          select: { id: true, email: true }
        },
        internal_notes: {
          include: {
            officer: {
              select: { id: true, email: true }
            }
          },
          orderBy: { created_at: 'asc' }
        },
        feedback: true
      }
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    // Authorization checks
    if (role === 'CITIZEN' && complaint.citizen_id !== userId) {
      throw new ForbiddenException('You do not have permission to view this complaint');
    }
    if (role === 'OFFICER' && complaint.department_id !== departmentId) {
      throw new ForbiddenException('You do not have permission to view complaints from other departments');
    }

    return complaint;
  }

  async updateStatus(id: string, userId: string, role: string, departmentId: string | undefined, dto: UpdateComplaintStatusDto) {
    const complaint = await this.findOne(id, userId, role, departmentId);

    if (role !== 'ADMIN' && role !== 'OFFICER') {
      throw new ForbiddenException('Only admins or officers can update complaint status');
    }

    const data: any = { status: dto.status };
    if (dto.status === 'RESOLVED') {
      data.resolution_description = dto.resolution_description;
      data.resolution_media = dto.resolution_media || [];
      data.resolved_at = new Date();
    }

    return this.prisma.complaint.update({
      where: { id },
      data,
    });
  }

  async assignOfficer(id: string, userId: string, role: string, departmentId: string | undefined, dto: AssignOfficerDto) {
    const complaint = await this.findOne(id, userId, role, departmentId);

    if (role !== 'ADMIN' && role !== 'OFFICER') {
      throw new ForbiddenException('Only admins or officers can assign officers to complaints');
    }

    if (dto.officer_id) {
      const officer = await this.prisma.user.findUnique({
        where: { id: dto.officer_id }
      });

      if (!officer || officer.role !== 'OFFICER') {
        throw new BadRequestException('Selected user is not an officer');
      }

      if (role !== 'ADMIN' && officer.department_id !== complaint.department_id) {
        throw new BadRequestException('Officer must belong to the same department as the complaint');
      }
    }

    return this.prisma.complaint.update({
      where: { id },
      data: { assigned_officer_id: dto.officer_id || null }
    });
  }

  async reassignDepartment(id: string, userId: string, role: string, departmentId: string | undefined, dto: ReassignDepartmentDto) {
    const complaint = await this.findOne(id, userId, role, departmentId);

    if (role !== 'ADMIN' && role !== 'OFFICER') {
      throw new ForbiddenException('Only admins or officers can reassign departments');
    }

    const dept = await this.prisma.department.findUnique({
      where: { id: dto.department_id }
    });
    if (!dept) {
      throw new NotFoundException(`Department with ID ${dto.department_id} not found`);
    }

    return this.prisma.complaint.update({
      where: { id },
      data: {
        department_id: dto.department_id,
        assigned_officer_id: null // clear officer assignment on department change
      }
    });
  }

  async addNote(id: string, userId: string, role: string, departmentId: string | undefined, dto: CreateNoteDto) {
    await this.findOne(id, userId, role, departmentId);

    if (role !== 'ADMIN' && role !== 'OFFICER') {
      throw new ForbiddenException('Only admins or officers can add internal notes');
    }

    return this.prisma.internalNote.create({
      data: {
        note: dto.note,
        complaint_id: id,
        officer_id: userId
      },
      include: {
        officer: {
          select: { id: true, email: true }
        }
      }
    });
  }
}
