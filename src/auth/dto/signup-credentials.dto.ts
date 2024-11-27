import { IsString, IsEmail, Matches, MaxLength, MinLength, IsUUID, IsOptional } from "class-validator";
import { UserRole } from "../user/user-role.enum";

export class SignUpCredentials {
    @IsString()
    DepartmentID: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @MaxLength(50)
    email: string;

    @IsString()
    @IsOptional()
    role: UserRole;
    
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$)/, 
        { message: 'Password is too weak!' }
    )
    password: string;
}
