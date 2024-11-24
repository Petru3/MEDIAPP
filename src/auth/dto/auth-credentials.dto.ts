import { IsString, IsEmail, Matches, MaxLength, MinLength, IsUUID, IsOptional } from "class-validator";
import { UserRole } from "../user/user-role.enum";

export class AuthCredentials {
    
    @IsUUID()
    @IsOptional()
    id: string;

    @IsString()
    DepartmentID: string;

    @IsString()
    FullName: string;

    @IsString()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be a valid 10-digit number' })
    PhoneNumber: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @MaxLength(50)
    email: string;

    @IsString()
    @MaxLength(100, { message: 'Address is too long. Max length is 100 characters' })
    Adress: string;
    
    @IsString()
    role: UserRole;
    
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$)/, 
        { message: 'Password is too weak!' }
    )
    password: string;

}
