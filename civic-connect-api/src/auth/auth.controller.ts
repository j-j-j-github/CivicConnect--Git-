import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { RegisterDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  // constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: any /* RegisterDto */) {
    // Logic to hash password and store citizen in DB via Prisma
    // return this.authService.register(registerDto);
    return {
      message: 'Citizen registered successfully',
      user: { 
        id: 'mock-uuid', 
        email: registerDto?.email || 'citizen@example.com', 
        role: 'CITIZEN' 
      }
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any /* LoginDto */) {
    // Logic to verify password and return JWT
    // return this.authService.login(loginDto);
    return {
      access_token: 'mock_jwt_token_here',
      user: { 
        id: 'mock-uuid', 
        email: loginDto?.email || 'citizen@example.com', 
        role: 'CITIZEN' 
      }
    };
  }
}
