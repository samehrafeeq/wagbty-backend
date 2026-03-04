import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Country, Governorate, City } from '../entities/location.entity';
import {
  CreateCountryDto,
  UpdateCountryDto,
  CreateGovernorateDto,
  UpdateGovernorateDto,
  CreateCityDto,
  UpdateCityDto,
} from './dto/location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(Governorate)
    private readonly governorateRepo: Repository<Governorate>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  // ==================== COUNTRIES ====================

  async getActiveCountries() {
    return this.countryRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async getAllCountries() {
    return this.countryRepo.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async createCountry(dto: CreateCountryDto) {
    const existing = await this.countryRepo.findOne({
      where: [{ name: dto.name }, { code: dto.code }],
    });
    if (existing) throw new BadRequestException('الدولة أو الكود موجود بالفعل');
    const country = this.countryRepo.create(dto as DeepPartial<Country>);
    return this.countryRepo.save(country);
  }

  async updateCountry(id: string, dto: UpdateCountryDto) {
    const country = await this.countryRepo.findOne({ where: { id } });
    if (!country) throw new NotFoundException('الدولة غير موجودة');
    Object.assign(country, dto);
    return this.countryRepo.save(country);
  }

  async deleteCountry(id: string) {
    const country = await this.countryRepo.findOne({ where: { id } });
    if (!country) throw new NotFoundException('الدولة غير موجودة');
    // Delete all related governorates and cities
    const governorates = await this.governorateRepo.find({ where: { countryId: id } });
    for (const gov of governorates) {
      await this.cityRepo.delete({ governorateId: gov.id });
    }
    await this.governorateRepo.delete({ countryId: id });
    await this.countryRepo.remove(country);
    return { message: 'تم حذف الدولة وجميع محافظاتها ومدنها' };
  }

  // ==================== GOVERNORATES ====================

  async getActiveGovernorates(countryId: string) {
    return this.governorateRepo.find({
      where: { countryId, isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async getAllGovernorates(countryId?: string) {
    const where = countryId ? { countryId } : {};
    return this.governorateRepo.find({
      where,
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async createGovernorate(dto: CreateGovernorateDto) {
    const country = await this.countryRepo.findOne({ where: { id: dto.countryId } });
    if (!country) throw new BadRequestException('الدولة غير موجودة');
    const governorate = this.governorateRepo.create(dto as DeepPartial<Governorate>);
    return this.governorateRepo.save(governorate);
  }

  async updateGovernorate(id: string, dto: UpdateGovernorateDto) {
    const gov = await this.governorateRepo.findOne({ where: { id } });
    if (!gov) throw new NotFoundException('المحافظة غير موجودة');
    Object.assign(gov, dto);
    return this.governorateRepo.save(gov);
  }

  async deleteGovernorate(id: string) {
    const gov = await this.governorateRepo.findOne({ where: { id } });
    if (!gov) throw new NotFoundException('المحافظة غير موجودة');
    await this.cityRepo.delete({ governorateId: id });
    await this.governorateRepo.remove(gov);
    return { message: 'تم حذف المحافظة وجميع مدنها' };
  }

  // ==================== CITIES ====================

  async getActiveCities(governorateId: string) {
    return this.cityRepo.find({
      where: { governorateId, isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async getAllCities(governorateId?: string) {
    const where = governorateId ? { governorateId } : {};
    return this.cityRepo.find({
      where,
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async createCity(dto: CreateCityDto) {
    const gov = await this.governorateRepo.findOne({ where: { id: dto.governorateId } });
    if (!gov) throw new BadRequestException('المحافظة غير موجودة');
    const city = this.cityRepo.create(dto as DeepPartial<City>);
    return this.cityRepo.save(city);
  }

  async updateCity(id: string, dto: UpdateCityDto) {
    const city = await this.cityRepo.findOne({ where: { id } });
    if (!city) throw new NotFoundException('المدينة غير موجودة');
    Object.assign(city, dto);
    return this.cityRepo.save(city);
  }

  async deleteCity(id: string) {
    const city = await this.cityRepo.findOne({ where: { id } });
    if (!city) throw new NotFoundException('المدينة غير موجودة');
    await this.cityRepo.remove(city);
    return { message: 'تم حذف المدينة' };
  }
}
