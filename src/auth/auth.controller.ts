import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { SignInCredentials } from './dto/signin-credentials.dto';
import { AuthGuard, IAuthGuard, Type } from '@nestjs/passport';
import { GetUser } from './user/get-user.decorator';
import { User } from './user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentials: AuthCredentials): Promise<void> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInCredentials: SignInCredentials,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInCredentials);
  }

  @Post('/test')
    @UseGuards(AuthGuard())
    test(
        @GetUser() user: User
    ) {
        console.log(user);
    }
}
