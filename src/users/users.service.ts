import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './interfaces/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  findOneById(id: UUID): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  update(userId: UUID, userInformation: Partial<User>): Promise<UpdateResult> {
    return this.repository.update(userId, userInformation);
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }
}
