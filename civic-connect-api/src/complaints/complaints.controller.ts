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
  @Patch(':id/override')
  async overrideComplaint(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.complaintsService.overrideComplaint(req.user.id, id, data);
  }

  @Get(':id/history')
  async getComplaintHistory(@Req() req: any, @Param('id') id: string) {
    return this.complaintsService.getComplaintHistory(req.user.id, id);
  }
}
