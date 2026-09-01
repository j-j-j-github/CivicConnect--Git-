import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsNumber()
  @IsOptional()
  location_lat?: number;

  @IsNumber()
  @IsOptional()
  location_lng?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  media_urls?: string[];

  @IsString()
  @IsNotEmpty()
  department_id: string;
}
