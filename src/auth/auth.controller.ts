import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterRestaurantDto } from './dto/register-restaurant.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ==================== USER ROUTES ====================

  @Post('user/register')
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('user/login')
  loginUser(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  @Get('user/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  getUserProfile(@CurrentUser('id') userId: string) {
    return this.authService.getUserProfile(userId);
  }

  // ==================== RESTAURANT ROUTES ====================

  @Post('restaurant/register')
  registerRestaurant(@Body() dto: RegisterRestaurantDto) {
    return this.authService.registerRestaurant(dto);
  }

  @Post('restaurant/login')
  loginRestaurant(@Body() dto: LoginDto) {
    return this.authService.loginRestaurant(dto);
  }

  @Get('restaurant/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant')
  getRestaurantProfile(@CurrentUser('id') restaurantId: string) {
    return this.authService.getRestaurantProfile(restaurantId);
  }
}
