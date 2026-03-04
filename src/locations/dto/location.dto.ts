import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty({ message: 'اسم الدولة مطلوب' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'كود الدولة مطلوب' })
  code: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCountryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateGovernorateDto {
  @IsString()
  @IsNotEmpty({ message: 'اسم المحافظة مطلوب' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'الدولة مطلوبة' })
  countryId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateGovernorateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateCityDto {
  @IsString()
  @IsNotEmpty({ message: 'اسم المدينة مطلوب' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'المحافظة مطلوبة' })
  governorateId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
