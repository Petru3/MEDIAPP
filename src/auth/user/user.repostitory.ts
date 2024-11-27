import { DataSource, EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { SignInCredentials } from '../dto/signin-credentials.dto';
import * as bcrypt from 'bcrypt';
import { UpdateCredentials } from '../dto/update-credentials.dto';
import { UserRole } from './user-role.enum';
import { SignUpCredentials } from '../dto/signup-credentials.dto';
@Injectable()
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // Get All Users
  async findAll(): Promise<User[]> {
    return await this.find();
  }

  // Get All Users by role
  async findByRole(role: UserRole): Promise<User[]> {
    return await this.find({ where: { role } });
  }

  // Creating new User
  async signUp(signUpCredentials: SignUpCredentials): Promise<void> {
    const { DepartmentID, email, password, role } = signUpCredentials;

    const user = new User();

    user.DepartmentID = DepartmentID;
    
    // Every user complete this after the first login
    user.FullName = '';
    user.PhoneNumber = '';
    user.Adress = '';

    user.role = role;
    user.email = email;

    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') { // ConflictException if email already exists
        throw new ConflictException('Email already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }

    this.logger.debug(`Successfully created an account for ${user.email}`);
  }

  // Get a User by Id
  async getUserById(id: string): Promise<User> {
    const account = await this.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  // Update a User by Id
  async updateUserById(
    id: string,
    updateCredentials: UpdateCredentials,
    user: User
  ): Promise<User> {
    const currentAccount = await this.findOne({ where: { id: id } });
    
    if (!currentAccount) {
      throw new NotFoundException(`User with ID ${id} not found!`);
    }

    if (user.role || user.password) {
      if (user.role !== UserRole.ADMIN && user.role !== UserRole.COORDONATOR) {
        throw new NotFoundException('You are not authorized to update role or password');
      }
    }

    Object.assign(currentAccount, updateCredentials);

    await this.save(currentAccount);

    return currentAccount;
  }

  async deleteUserById(id: string): Promise<void> {
    const currentAccount = await this.getUserById(id);

    if (!currentAccount) {
      throw new NotFoundException(`Account with ID "${id}" not found.`);
    }

    const result = await this.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID "${id}" not found.`);
    }
  }

  async ValidateUserPassword(signInCredentials: SignInCredentials): Promise<User> {
    const { email, password } = signInCredentials;

    const user = await this.findOne({ where: { email } });

    if (user && await user.validatePassword(password)) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
