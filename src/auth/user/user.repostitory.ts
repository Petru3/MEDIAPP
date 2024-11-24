import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { AuthCredentials } from "../dto/auth-credentials.dto";
import { SignInCredentials } from "../dto/signin-credentials.dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserRepository extends Repository<User> { 
    private logger = new Logger('UserRepository');
    
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(User, dataSource.createEntityManager());
    }

    async signUp(
        authCredentials: AuthCredentials
    ): Promise<void> {
        const { 
            DepartmentID, 
            FullName, 
            PhoneNumber,
            email,
            Adress,
            password, 
            role
        } = authCredentials;

        const user = new User();
        user.DepartmentID = DepartmentID;
        user.FullName = FullName;
        user.PhoneNumber = PhoneNumber;
        user.email = email;
        user.Adress = Adress;
        user.role = role;
        
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
    
        this.logger.log('Generated salt:', user.salt); // Ar trebui să fie un string

        try{
            await this.save(user);
        }catch(error){
            if (error.code === '23505') {  // Duplicate email error code
                throw new ConflictException('Email already exists!');
            } else {
                throw new InternalServerErrorException();
            }
        }

        this.logger.debug(`Successfully created an account for ${user.email}`);
    }

    async ValidateUserPassword(
        signInCredentials: SignInCredentials
    ): Promise<User> {
        const { email, password } = signInCredentials;

        const user = await this.findOne({where: { email }});

        if(user && await user.validatePassword(password)){
            return user;
        }else {
            return null;
        }
    }

    private async hashPassword(
        password: string,
        salt: string,
    ): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}