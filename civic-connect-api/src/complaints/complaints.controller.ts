import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { AssignOfficerDto } from './dto/assign-officer.dto';
import { ReassignDepartmentDto } from './dto/reassign-department.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService,
    private readonly prisma: PrismaService
  ) {}

  private async getDepartmentId(userId: string, role: string): Promise<string | undefined> {
    if (role !== 'OFFICER') return undefined;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { department_id: true }
    });
    return user?.department_id || undefined;
  }

  @Post()
  create(@Request() req: any, @Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintsService.create(req.user.id, createComplaintDto);
  }

  @Get()
  async findAll(@Request() req: any) {
    const deptId = await this.getDepartmentId(req.user.id, req.user.role);
    return this.complaintsService.findAll(req.user.id, req.user.role, deptId);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const deptId = await this.getDepartmentId(req.user.id, req.user.role);
    return this.complaintsService.findOne(id, req.user.id, req.user.role, deptId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateComplaintStatusDto: UpdateComplaintStatusDto,
  ) {
    const deptId = await this.getDepartmentId(req.user.id, req.user.role);
    return this.complaintsService.updateStatus(id, req.user.id, req.user.role, deptId, updateComplaintStatusDto);
  }

  @Patch(':id/assign-officer')
  async assignOfficer(
    @Request() req: any,
    @Param('id') id: string,
    @Body() assignOfficerDto: AssignOfficerDto,
  ) {
    const deptId = await this.getDepartmentId(req.user.id, req.user.role);
    return this.complaintsService.assignOfficer(id, req.user.id, req.user.role, deptId, assignOfficerDto);
  }

  @Patch(':id/reassign-department')
  async reassignDepartment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() reassignDepartmentDto: ReassignDepartmentDto,
  ) {
    const deptId = await this.getDepartmentId(req.user.id, req.user.role);
    return this.complaintsService.reassignDepartment(id, req.user.id, req.user.role, deptId, reassignDepartmentDto);
  }

  @Post(':id/notes')
  async addNote(
    @Request() req: any,
    @Param('id') id: string,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    const deptId = await this.getDepartmentId(req.user.id, req.user.role);
    return this.complaintsService.addNote(id, req.user.id, req.user.role, deptId, createNoteDto);
  }
}
