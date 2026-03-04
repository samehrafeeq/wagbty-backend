import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'اسم التصنيف مطلوب' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  sortOrder?: number;
}
