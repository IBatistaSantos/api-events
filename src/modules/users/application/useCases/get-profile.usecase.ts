import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/user';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
