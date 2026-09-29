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

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    try {
      await fsPromises.writeFile(filePath, file.buffer);

      // Return public URL (assuming the backend serves it under /uploads/)
      const port = process.env.PORT || 3001;
      const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
      return `${baseUrl}/uploads/${fileName}`;
    } catch (error) {
      this.logger.error(`Failed to upload file to disk: ${error.message}`);
      throw new BadRequestException('File upload failed');
    }
  }
}
