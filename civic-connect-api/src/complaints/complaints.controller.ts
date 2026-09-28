import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { AssignOfficerDto } from './dto/assign-officer.dto';
import { ReassignDepartmentDto } from './dto/reassign-department.dto';
import { CreateNoteDto } from './dto/create-note.dto';

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
  async getAllComplaints(@Req() req: any) {
    return this.complaintsService.getAllComplaints(req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICER)
  @Get(':id')
  async getComplaintById(@Param('id') id: string) {
    return this.complaintsService.getComplaintById(id);
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
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.complaintsService.updateComplaintStatus(req.user.id, id, data);
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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICER)
  @Patch(':id/assign-officer')
  async assignOfficer(@Req() req: any, @Param('id') id: string, @Body() data: AssignOfficerDto) {
    return this.complaintsService.assignOfficer(id, req.user.id, req.user.role, undefined, data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICER)
  @Patch(':id/reassign-department')
  async reassignDepartment(@Req() req: any, @Param('id') id: string, @Body() data: ReassignDepartmentDto) {
    return this.complaintsService.reassignDepartment(id, req.user.id, req.user.role, undefined, data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OFFICER)
  @Post(':id/notes')
  async addNote(@Req() req: any, @Param('id') id: string, @Body() data: CreateNoteDto) {
    return this.complaintsService.addNote(id, req.user.id, req.user.role, undefined, data);
  }
}

