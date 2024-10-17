import { Controller, Get, Param } from '@nestjs/common';
import { User } from './interfaces/user.entity';
import { UsersService } from './users.service';
import { UUID } from 'crypto';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLES } from 'src/constans/roles';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':id')
  public getUserById(@Param('id') id: UUID): Promise<User | null> {
    console.log(id);
    return this.userService.findOneById(id);
  }

  @Get()
  @Roles([ROLES.ADMIN])
  public getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
