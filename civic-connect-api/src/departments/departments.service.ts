import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: createDepartmentDto,
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        _count: {
          select: {
            complaints: true,
            officers: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        complaints: true,
        officers: {
          select: {
            id: true,
            email: true,
            role: true,
            created_at: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    // Check if exists
    await this.findOne(id);

    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  }

  async remove(id: string) {
    // Check if exists
    await this.findOne(id);

    return this.prisma.department.delete({
      where: { id },
    });
  }
}
