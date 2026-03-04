import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterRestaurantDto } from './dto/register-restaurant.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
    private jwtService: JwtService,
  ) {}

  // ==================== USER AUTH ====================

  async registerUser(dto: RegisterUserDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('كلمة المرور وتأكيدها غير متطابقتين');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('البريد الإلكتروني مسجل بالفعل');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      role: 'user',
      countryId: dto.countryId || null,
      governorateId: dto.governorateId || null,
      cityId: dto.cityId || null,
    } as DeepPartial<User>);

    const savedUser = await this.usersRepository.save(user);

    const token = this.generateToken(savedUser.id, savedUser.email, 'user');

    return {
      message: 'تم إنشاء الحساب بنجاح',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: 'user',
      },
      token,
    };
  }

  async loginUser(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'name', 'email', 'phone', 'password', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  // ==================== RESTAURANT AUTH ====================

  async registerRestaurant(dto: RegisterRestaurantDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('كلمة المرور وتأكيدها غير متطابقتين');
    }

    const existingRestaurant = await this.restaurantsRepository.findOne({
      where: { email: dto.email },
    });

    if (existingRestaurant) {
      throw new BadRequestException('البريد الإلكتروني مسجل بالفعل');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const restaurant = this.restaurantsRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      description: dto.description,
      address: dto.address,
      category: dto.category,
      role: 'restaurant',
      isApproved: false,
      countryId: dto.countryId || null,
      governorateId: dto.governorateId || null,
      cityId: dto.cityId || null,
    } as DeepPartial<Restaurant>);

    const savedRestaurant = await this.restaurantsRepository.save(restaurant);

    return {
      message: 'تم إنشاء حساب المطعم بنجاح. يرجى انتظار موافقة الإدارة لتفعيل الحساب.',
      restaurant: {
        id: savedRestaurant.id,
        name: savedRestaurant.name,
        email: savedRestaurant.email,
        phone: savedRestaurant.phone,
        description: savedRestaurant.description,
        address: savedRestaurant.address,
        category: savedRestaurant.category,
        role: 'restaurant',
        isApproved: false,
      },
      needsApproval: true,
    };
  }

  async loginRestaurant(dto: LoginDto) {
    const restaurant = await this.restaurantsRepository.findOne({
      where: { email: dto.email },
      select: [
        'id',
        'name',
        'email',
        'phone',
        'password',
        'description',
        'address',
        'category',
        'image',
        'rating',
        'role',
        'isApproved',
      ],
    });

    if (!restaurant) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      restaurant.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    if (!restaurant.isApproved) {
      throw new UnauthorizedException('حسابك قيد المراجعة. يرجى انتظار موافقة الإدارة.');
    }

    const token = this.generateToken(
      restaurant.id,
      restaurant.email,
      'restaurant',
    );

    return {
      message: 'تم تسجيل الدخول بنجاح',
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        email: restaurant.email,
        phone: restaurant.phone,
        description: restaurant.description,
        address: restaurant.address,
        category: restaurant.category,
        image: restaurant.image,
        rating: restaurant.rating,
        role: 'restaurant',
      },
      token,
    };
  }

  // ==================== PROFILE ====================

  async getUserProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('المستخدم غير موجود');
    }

    return { user };
  }

  async getRestaurantProfile(restaurantId: string) {
    const restaurant = await this.restaurantsRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new UnauthorizedException('المطعم غير موجود');
    }

    return { restaurant };
  }

  // ==================== HELPERS ====================

  private generateToken(id: string, email: string, role: string): string {
    return this.jwtService.sign({
      sub: id,
      email,
      role,
    });
  }
}
