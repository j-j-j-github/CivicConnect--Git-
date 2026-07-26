import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    const adapter = new PrismaPg(pool);
    
    super({
      adapter,
      log: ['query', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
