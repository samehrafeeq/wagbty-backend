import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import {
  CreateCountryDto,
  UpdateCountryDto,
  CreateGovernorateDto,
  UpdateGovernorateDto,
  CreateCityDto,
  UpdateCityDto,
} from './dto/location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // ==================== PUBLIC (Active only) ====================

  @Get('countries')
  getActiveCountries() {
    return this.locationsService.getActiveCountries();
  }

  @Get('governorates/:countryId')
  getActiveGovernorates(@Param('countryId') countryId: string) {
    return this.locationsService.getActiveGovernorates(countryId);
  }

  @Get('cities/:governorateId')
  getActiveCities(@Param('governorateId') governorateId: string) {
    return this.locationsService.getActiveCities(governorateId);
  }

  // ==================== ADMIN: Countries ====================

  @Get('admin/countries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllCountries() {
    return this.locationsService.getAllCountries();
  }

  @Post('admin/countries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createCountry(@Body() dto: CreateCountryDto) {
    return this.locationsService.createCountry(dto);
  }

  @Put('admin/countries/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateCountry(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
    return this.locationsService.updateCountry(id, dto);
  }

  @Delete('admin/countries/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteCountry(@Param('id') id: string) {
    return this.locationsService.deleteCountry(id);
  }

  // ==================== ADMIN: Governorates ====================

  @Get('admin/governorates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllGovernorates(@Query('countryId') countryId?: string) {
    return this.locationsService.getAllGovernorates(countryId);
  }

  @Post('admin/governorates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createGovernorate(@Body() dto: CreateGovernorateDto) {
    return this.locationsService.createGovernorate(dto);
  }

  @Put('admin/governorates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateGovernorate(@Param('id') id: string, @Body() dto: UpdateGovernorateDto) {
    return this.locationsService.updateGovernorate(id, dto);
  }

  @Delete('admin/governorates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteGovernorate(@Param('id') id: string) {
    return this.locationsService.deleteGovernorate(id);
  }

  // ==================== ADMIN: Cities ====================

  @Get('admin/cities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllCities(@Query('governorateId') governorateId?: string) {
    return this.locationsService.getAllCities(governorateId);
  }

  @Post('admin/cities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createCity(@Body() dto: CreateCityDto) {
    return this.locationsService.createCity(dto);
  }

  @Put('admin/cities/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateCity(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.locationsService.updateCity(id, dto);
  }

  @Delete('admin/cities/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteCity(@Param('id') id: string) {
    return this.locationsService.deleteCity(id);
  }
}
