import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { ComplaintStatus } from '@prisma/client';

export class UpdateComplaintStatusDto {
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus;

  @IsString()
  @IsOptional()
  resolution_description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  resolution_media?: string[];
}
