import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComplaintStatus } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async submitFeedback(userId: string, complaintId: string, rating: number, comments?: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { feedback: true }
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    if (complaint.citizen_id !== userId) {
      throw new ForbiddenException('You can only review your own complaints');
    }

    if (complaint.status !== ComplaintStatus.RESOLVED) {
      throw new BadRequestException('You can only rate resolved complaints');
    }

    if (complaint.feedback) {
      throw new BadRequestException('Feedback already submitted for this complaint');
    }

    return this.prisma.feedback.create({
      data: {
        rating,
        comments,
        complaint_id: complaintId,
        citizen_id: userId,
      }
    });
  }
}
