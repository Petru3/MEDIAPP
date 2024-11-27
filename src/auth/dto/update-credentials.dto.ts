import { IsString, IsEmail, Matches, MaxLength, MinLength, IsUUID, IsOptional } from 'class-validator';
import { UserRole } from '../user/user-role.enum';

export class UpdateCredentials {
  @IsString()
  @IsOptional()
  FullName?: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be a valid 10-digit number' })
  @IsOptional()
  PhoneNumber?: string;

  @IsString()
  @MaxLength(100, { message: 'Address is too long. Max length is 100 characters' })
  @IsOptional()
  Adress?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(50)
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role?: UserRole;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$)/, 
    { message: 'Password is too weak!' })
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  DepartmentID?: string;
}
