import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInCredentials } from './dto/signin-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './user/get-user.decorator';
import { User } from './user/user.entity';
import { UserRole } from './user/user-role.enum';
import { UpdateCredentials } from './dto/update-credentials.dto';
import { SignUpCredentials } from './dto/signup-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private checkUserPrivileges(user: User): void {
    if (
      user.role === UserRole.SUBCOORDONATOR ||
      user.role === UserRole.VOLUNTEER ||
      user.role === UserRole.PROFESSOR
    ) {
      throw new NotFoundException('Your role does not have enough privileges');
    }
  }

  @Post('/signup')
  // @UseGuards(AuthGuard())
  async signUp(
    @Body(ValidationPipe) signUpCredentials: SignUpCredentials, 
    @GetUser() user: User
  ): Promise<void> {

    // if (![UserRole.ADMIN, UserRole.COORDONATOR].includes(user.role)) {
    //   throw new NotFoundException('You do not have permission to create accounts');
    // }
    
    return this.authService.signUp(signUpCredentials);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) signInCredentials: SignInCredentials,
  ): Promise<{ accessToken: string }> {

    return this.authService.signIn(signInCredentials);

  }

  @Get()
  @UseGuards(AuthGuard())
  async getUsers(
    @GetUser() user: User,
    @Query('role') role?: UserRole,
    @Query('departmentId') departmentId?: string,
  ): Promise<User[]> {

    this.checkUserPrivileges(user);

    if (role && !Object.values(UserRole).includes(role)) {
      throw new NotFoundException('Invalid role provided');
    }
    return this.authService.getUsers(role, departmentId);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getUserById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<User> {
    this.checkUserPrivileges(user);

    return this.authService.getUserById(id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard())
  async updateUserById(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCredentials: UpdateCredentials,
    @GetUser() user: User
  ): Promise<User> {

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.COORDONATOR) {

      if (user.id !== id) {
        throw new NotFoundException(`You can't update others' profiles!`);
      }

      const allowedFields = ['FullName', 'PhoneNumber', 'Adress'];
      const invalidFields = Object.keys(updateCredentials).filter(
        (key) => !allowedFields.includes(key)
      );
      if (invalidFields.length > 0) {
        throw new BadRequestException(
          `Invalid fields: ${invalidFields.join(', ')}. You can only update ${allowedFields.join(', ')}.`
        );
      }
    }

    return this.authService.updateUserById(id, updateCredentials, user);
  }
  
  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteUserById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<void> {

    this.checkUserPrivileges(user);

    // Coordonator cannot delete Admin accounts
    if (user.role === UserRole.COORDONATOR) {
      const accountToDelete = await this.authService.getUserById(id);
      if (accountToDelete.role === UserRole.ADMIN) {
        throw new NotFoundException('Coordinators cannot delete Admin accounts!');
      }
    }

    return this.authService.deleteUserById(id);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
