import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CitizensService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { citizenProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Exclude password_hash
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, data: any) {
    const profile = await this.prisma.citizenProfile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Citizen profile not found');
    }

    const updatedProfile = await this.prisma.citizenProfile.update({
      where: { user_id: userId },
      data: {
        full_name: data.full_name !== undefined ? data.full_name : profile.full_name,
        phone: data.phone !== undefined ? data.phone : profile.phone,
        address: data.address !== undefined ? data.address : profile.address,
      },
    });

    return updatedProfile;
  }
}
