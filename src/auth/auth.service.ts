import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user/user.repostitory';
import { JwtService } from '@nestjs/jwt';
import { SignInCredentials } from './dto/signin-credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentials): Promise<void> {
    return this.userRepository.signUp(authCredentials);
  }

  async signIn(signInCredentials: SignInCredentials): Promise<{ accessToken: string }> {
    const user = await this.userRepository.ValidateUserPassword(signInCredentials);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
    return { accessToken };
  }
}
