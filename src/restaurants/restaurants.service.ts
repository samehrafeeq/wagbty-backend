import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantsRepository.findOne({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException('المطعم غير موجود');
    }
    return restaurant;
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantsRepository.find({
      where: { isActive: true, isApproved: true },
    });
  }

  async findAllForAdmin(): Promise<Restaurant[]> {
    return this.restaurantsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async approveRestaurant(id: string): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    restaurant.isApproved = true;
    return this.restaurantsRepository.save(restaurant);
  }

  async rejectRestaurant(id: string): Promise<void> {
    const restaurant = await this.findById(id);
    await this.restaurantsRepository.remove(restaurant);
  }

  async updateProfile(
    id: string,
    data: Partial<
      Pick<
        Restaurant,
        'name' | 'phone' | 'description' | 'address' | 'category' | 'image'
      >
    >,
  ): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    Object.assign(restaurant, data);
    return this.restaurantsRepository.save(restaurant);
  }
}
