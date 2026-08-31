import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { CitizensService } from './citizens.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('citizens')
export class CitizensController {
  constructor(private readonly citizensService: CitizensService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.citizensService.getProfile(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    return this.citizensService.updateProfile(req.user.id, updateData);
  }
}
