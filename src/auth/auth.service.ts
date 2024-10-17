import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/interfaces/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-repsonse.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login(user: LoginRequestDto): Promise<LoginResponseDto> {
    const validatedUser = await this.validateUser(user.email, user.password);
    const payload = { sub: validatedUser.id, email: validatedUser.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: { ...validatedUser, password: undefined },
    };
  }

  async register(
    user: RegisterRequestDto,
  ): Promise<RegisterResponseDto | BadRequestException> {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = { ...user, password: hashedPassword };
    await this.usersService.create(newUser);
    return { user: { ...user } };
  }

  async isAuthenticated(
    token: string,
  ): Promise<LoginResponseDto | BadRequestException> {
    try {
      const decoded = this.jwtService.verify(token); // Validate token
      const user = await this.usersService.findOneById(decoded.sub);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      return {
        access_token: token,
        user: { ...user, password: undefined },
      };
    } catch (err) {
      console.error('invalid token', err);
      throw new BadRequestException('Invalid token');
    }
  }

  async getMe(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token); // Validate token
      const user = await this.usersService.findOneById(decoded.sub);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      return {
        ...user,
        password: undefined,
      };
    } catch (err) {
      console.error('invalid token', err);
      throw new BadRequestException('Invalid token');
    }
  }
}
