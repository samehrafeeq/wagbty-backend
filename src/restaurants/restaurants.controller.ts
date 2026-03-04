import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // Public: list all approved restaurants
  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  // Admin: list all restaurants (including unapproved)
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAllAdmin() {
    return this.restaurantsService.findAllForAdmin();
  }

  // Admin: approve restaurant
  @Put('admin/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  approveRestaurant(@Param('id') id: string) {
    return this.restaurantsService.approveRestaurant(id);
  }

  // Admin: reject (delete) restaurant
  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  rejectRestaurant(@Param('id') id: string) {
    return this.restaurantsService.rejectRestaurant(id);
  }

  // Public: get restaurant by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findById(id);
  }

  // Protected: restaurant updates own profile
  @Put('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant')
  updateProfile(
    @CurrentUser('id') restaurantId: string,
    @Body()
    data: {
      name?: string;
      phone?: string;
      description?: string;
      address?: string;
      category?: string;
      image?: string;
    },
  ) {
    return this.restaurantsService.updateProfile(restaurantId, data);
  }
}
