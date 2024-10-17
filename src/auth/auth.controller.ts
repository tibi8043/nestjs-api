import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponseDto } from './dto/login-repsonse.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from 'src/users/interfaces/user.entity';
import { LoginRequestDto } from './dto/login-request.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() req: LoginRequestDto,
  ): Promise<LoginResponseDto | BadRequestException> {
    return await this.authService.login(req);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDto | BadRequestException> {
    return await this.authService.register(registerBody);
  }

  @UseGuards(JwtGuard)
  @Get('isAuthenticated')
  async isAuthenticated(
    @Request() req,
  ): Promise<LoginResponseDto | BadRequestException> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid or missing Authorization header');
    }
    const token = authHeader.split(' ')[1];
    const user = await this.authService.isAuthenticated(token);
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('getMe')
  async getMe(@Request() req): Promise<User | BadRequestException> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid or missing Authorization header');
    }
    const token = authHeader.split(' ')[1];
    const user = await this.authService.getMe(token);
    return user;
  }
}
