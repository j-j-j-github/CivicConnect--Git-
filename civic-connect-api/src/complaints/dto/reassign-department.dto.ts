import { IsString, IsNotEmpty } from 'class-validator';

export class ReassignDepartmentDto {
  @IsString()
  @IsNotEmpty()
  department_id: string;
}
