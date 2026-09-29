import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      const base64String = file.buffer.toString('base64');
      const mimeType = file.mimetype || 'image/jpeg';
      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      this.logger.error(`Failed to process file: ${error.message}`);
      throw new BadRequestException('File upload failed');
    }
  }
}
