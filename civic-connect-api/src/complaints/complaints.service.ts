import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
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
          title: data.category || 'General Complaint', // title is required by AI service
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
        message: 'A similar complaint was recently submitted.',
        duplicateDetected: true,
        duplicateComplaintId: aiResponse.duplicate_complaint_id,
        similarityScore: aiResponse.duplicate_similarity_score,
      });
    }

    // 4. Determine final department and priority
    let aiDepartmentName = aiResponse ? aiResponse.recommended_department : 'General';
    let department = await this.prisma.department.findFirst({
      where: { name: aiDepartmentName }
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
        title: data.title || 'General Complaint',
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
}
