import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      url: process.env.DATABASE_URL,
    } as any); // Using 'as any' just in case Prisma 7 changed the options typing
  }
  async onModuleInit() {
    await this.$connect();
  }
}
