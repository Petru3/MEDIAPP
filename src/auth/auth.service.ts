import { Injectable, UnauthorizedException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user/user.repostitory';
import { JwtService } from '@nestjs/jwt';
import { SignInCredentials } from './dto/signin-credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from './user/user.entity';
import { UpdateCredentials } from './dto/update-credentials.dto';
import { UserRole } from './user/user-role.enum';
import { SignUpCredentials } from './dto/signup-credentials.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpCredentials: SignUpCredentials): Promise<void> {
    return this.userRepository.signUp(signUpCredentials);
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

  async getUsers(
    role?: UserRole,
    departmentId?: string
  ): Promise<User[]> {
    if (role) {
      return this.userRepository.findByRole(role);
    }
    if(departmentId) {
      return this.userRepository.findByDepartmentId(departmentId);
    }
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }

  async updateUserById(id: string, updateCredentials: UpdateCredentials, user: User): Promise<User> {
    return this.userRepository.updateUserById(id, updateCredentials, user);
  }

  async deleteUserById(id: string): Promise<void> {
    try {
      await this.userRepository.deleteUserById(id);
    } catch (error) {
      this.logger.error('Error deleting user:', error);
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
