import { Controller, Get, Post, UseGuards, Req, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Roles('ADMIN')
  getStats() {
    return this.adminService.getStats();
  }

  @Post('message-department/:id')
  @Roles('ADMIN')
  async messageDepartment(
    @Req() req: any,
    @Param('id') id: string,
    @Body('message') message: string
  ) {
    return this.adminService.messageDepartment(req.user.id, id, message);
  }

  @Get('officers')
  @Roles('ADMIN')
  async getOfficers() {
    return this.adminService.getOfficers();
  }

  @Post('officers')
  @Roles('ADMIN')
  async addOfficer(@Body() body: { email: string; full_name: string; department_id: string; password?: string }) {
    return this.adminService.addOfficer(body);
  }
}
