import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }
    return user;
  }

  async updateProfile(
    id: string,
    data: Partial<Pick<User, 'name' | 'phone'>>,
  ): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, data);
    return this.usersRepository.save(user);
  }
}
