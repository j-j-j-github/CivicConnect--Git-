import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComplaintStatus } from '@prisma/client';

const STATUS_MAP: Record<string, ComplaintStatus> = {
  PENDING:     ComplaintStatus.PENDING,
  VERIFIED:    ComplaintStatus.VERIFIED,
  IN_PROGRESS: ComplaintStatus.VERIFIED, // alias used in UI
  RESOLVED:    ComplaintStatus.RESOLVED,
  REJECTED:    ComplaintStatus.REJECTED,
};

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}
  async getMyComplaints(userId: string) {
    return this.prisma.complaint.findMany({
      where: { citizen_id: userId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        location_lat: true,
        location_lng: true,
        media_urls: true,
        created_at: true,
        department: { select: { id: true, name: true } },
        feedback: { select: { rating: true, comments: true, created_at: true } },
        // ai_* and override fields intentionally omitted — citizens should not see AI internals
      },
    });
  }

  /** Returns the AI analysis fields for a single complaint. Call only from officer/admin routes. */
  async getAiInsights(complaintId: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
      select: {
        id: true,
        ai_category: true,
        ai_department: true,
        ai_priority: true,
        ai_confidence: true,
        ai_summary: true,
        is_ai_overridden: true,
        override_reason: true,
        overridden_at: true,
        overriddenById: true,
      },
    });
    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }
    return complaint;
  }

  /** Returns all complaints with full details for officer/admin portal. */
  async getAllComplaints(user: any) {
    const whereClause = user.role === 'ADMIN' ? {} : { department_id: user.department_id };
    return this.prisma.complaint.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        location_lat: true,
        location_lng: true,
        media_urls: true,
        created_at: true,
        // AI fields
        ai_category: true,
        ai_department: true,
        ai_priority: true,
        ai_confidence: true,
        ai_summary: true,
        is_ai_overridden: true,
        override_reason: true,
        overridden_at: true,
        overriddenById: true,
        // Relations
        citizen: { select: { id: true, email: true, citizenProfile: { select: { full_name: true } } } },
        department: { select: { id: true, name: true } },
        feedback: { select: { rating: true, comments: true } },
        assigned_officer_id: true,
        assigned_officer: { select: { id: true, email: true } },
        internal_notes: {
          select: { id: true, note: true, created_at: true, officer: { select: { id: true, email: true } } },
          orderBy: { created_at: 'asc' }
        }
      },
    });
  }

  async getComplaintById(id: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        location_lat: true,
        location_lng: true,
        media_urls: true,
        created_at: true,
        // AI fields
        ai_category: true,
        ai_department: true,
        ai_priority: true,
        ai_confidence: true,
        ai_summary: true,
        is_ai_overridden: true,
        override_reason: true,
        overridden_at: true,
        overriddenById: true,
        // Relations
        citizen: { select: { id: true, email: true, citizenProfile: { select: { full_name: true } } } },
        department: { select: { id: true, name: true } },
        feedback: { select: { rating: true, comments: true } },
        assigned_officer_id: true,
        assigned_officer: { select: { id: true, email: true } },
        internal_notes: {
          select: { id: true, note: true, created_at: true, officer: { select: { id: true, email: true } } },
          orderBy: { created_at: 'asc' }
        }
      },
    });
    if (!complaint) throw new NotFoundException('Complaint not found');
    return complaint;
  }

  /** Updates complaint status and notifies the citizen. Officer/admin only. */
  async updateComplaintStatus(officerId: string, complaintId: string, data: any) {
    const { status: newStatus, note, resolution_description, resolution_media } = data;
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { id: true, citizen_id: true, title: true },
    });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const status = STATUS_MAP[newStatus.toUpperCase()];
    if (!status) throw new BadRequestException(`Invalid status: ${newStatus}`);

    const updateData: any = { status };
    if (status === 'RESOLVED') {
      updateData.resolution_description = resolution_description;
      updateData.resolution_media = resolution_media || [];
      updateData.resolved_at = new Date();
    }

    const updated = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: updateData,
    });

    await this.prisma.complaintStatusHistory.create({
      data: {
        complaintId: complaint.id,
        status,
        note: note || `Status updated to ${newStatus}`,
        changedById: officerId,
      },
    });

    // Notify the citizen
    const statusLabel =
      status === ComplaintStatus.VERIFIED  ? 'In Progress' :
      status === ComplaintStatus.RESOLVED  ? 'Resolved'    :
      status === ComplaintStatus.REJECTED  ? 'Rejected'    : 'Pending';
    await this.prisma.notification.create({
      data: {
        user_id: complaint.citizen_id,
        message: `Your complaint "${complaint.title}" has been updated to ${statusLabel}.${note ? ` Note: ${note}` : ''}`,
      },
    });

    return updated;
  }

  async createComplaint(userId: string, data: any) {
    // 1. Fetch recent complaints for duplicate checking
    const recentComplaints = await this.prisma.complaint.findMany({
      take: 20,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        ai_category: true,
        location_lat: true,
        location_lng: true,
        created_at: true,
      }
    });

    const historicalReports = recentComplaints.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.ai_category,
      location_lat: c.location_lat,
      location_lng: c.location_lng,
      created_at: c.created_at.toISOString(),
    }));

    // 2. Call AI Service
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    let aiResponse: any = null;
    try {
      const response = await fetch(`${aiServiceUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title || 'General Complaint',
          description: data.description,
          location_lat: data.latitude,
          location_lng: data.longitude,
          historical_reports: historicalReports,
        }),
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        aiResponse = await response.json();
      } else {
        console.error('AI Service returned an error:', await response.text());
      }
    } catch (error: any) {
      console.error('Failed to communicate with AI Service:', error.message);
    }

    // 3. Duplicate Detection Handling
    if (aiResponse && aiResponse.duplicate_detected && !data.forceCreate) {
      throw new ConflictException({
        message: 'A similar complaint was already reported nearby.',
        duplicateDetected: true,
        duplicateComplaintId: aiResponse.duplicate_complaint_id,
      });
    }

    // 4. Determine final department and priority
    let aiDepartmentName = aiResponse ? aiResponse.recommended_department : 'General';
    let department = await this.prisma.department.findFirst({
      where: { name: { contains: aiDepartmentName, mode: 'insensitive' } }
    });

    if (!department) {
      console.warn(`AI Recommended department '${aiDepartmentName}' not found. Using fallback.`);
      department = await this.prisma.department.findFirst({ where: { name: 'General' } });
      if (!department) {
        department = await this.prisma.department.findFirst(); // Ultimate fallback
        if (!department) {
            throw new BadRequestException('No departments exist in the system.');
        }
      }
    }

    const priority = aiResponse ? aiResponse.priority : 'LOW';

    // 5. Create Complaint
    const complaint = await this.prisma.complaint.create({
      data: {
        title: data.title || 'Untitled Complaint',
        description: data.description,
        status: ComplaintStatus.PENDING,
        priority: priority,
        location_lat: data.latitude,
        location_lng: data.longitude,
        media_urls: data.media_urls || [],
        citizen_id: userId,
        department_id: department.id,
        
        // AI specific fields
        ai_category: aiResponse ? aiResponse.category : null,
        ai_department: aiResponse ? aiResponse.recommended_department : null,
        ai_priority: aiResponse ? aiResponse.priority : null,
        ai_confidence: aiResponse ? aiResponse.confidence : null,
        ai_summary: aiResponse ? aiResponse.summary : null,
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

  async overrideComplaint(userId: string, complaintId: string, overrideData: { department_id?: string, priority?: string, reason: string }) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
    });
    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }
    
    const updateData: any = {
      is_ai_overridden: true,
      override_reason: overrideData.reason,
      overridden_at: new Date(),
      overriddenById: userId,
    };
    
    if (overrideData.department_id) {
      updateData.department_id = overrideData.department_id;
    }
    if (overrideData.priority) {
      updateData.priority = overrideData.priority;
    }

    const updated = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: updateData,
    });
    return updated;
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

  async assignOfficer(id: string, userId: string, role: string, departmentId: string | undefined, dto: any) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) throw new NotFoundException(`Complaint with ID ${id} not found`);

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

  async reassignDepartment(id: string, userId: string, role: string, departmentId: string | undefined, dto: any) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) throw new NotFoundException(`Complaint with ID ${id} not found`);

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

  async addNote(id: string, userId: string, role: string, departmentId: string | undefined, dto: any) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) throw new NotFoundException(`Complaint with ID ${id} not found`);

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
