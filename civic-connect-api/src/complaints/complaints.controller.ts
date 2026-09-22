import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get('my')
  async getMyComplaints(@Req() req: any) {
    return this.complaintsService.getMyComplaints(req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICER)
  @Get()
  async getAllComplaints() {
    return this.complaintsService.getAllComplaints();
  }

  @Post()
  async createComplaint(@Req() req: any, @Body() data: any) {
    return this.complaintsService.createComplaint(req.user.id, data);
  }

  @Patch(':id/reopen')
  async reopenComplaint(@Req() req: any, @Param('id') id: string) {
    return this.complaintsService.reopenComplaint(req.user.id, id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICER)
  @Patch(':id/status')
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body() data: { status: string; note?: string }) {
    return this.complaintsService.updateComplaintStatus(req.user.id, id, data.status, data.note);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICER)
  @Patch(':id/override')
  async overrideComplaint(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.complaintsService.overrideComplaint(req.user.id, id, data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICER)
  @Get(':id/ai-insights')
  async getAiInsights(@Param('id') id: string) {
    return this.complaintsService.getAiInsights(id);
  }

  @Get(':id/history')
  async getComplaintHistory(@Req() req: any, @Param('id') id: string) {
    return this.complaintsService.getComplaintHistory(req.user.id, id);
  }
}

