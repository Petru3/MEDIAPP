import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserRole } from "./user-role.enum";
import * as bcrypt from 'bcrypt'

@Entity()
@Unique(['email'])
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    DepartmentID: string;

    @Column()
    FullName: string;

    @Column()
    PhoneNumber: string;
    
    @Column()
    email: string;

    @Column()
    Adress: string;

    @Column()
    password: string;

    @Column(
        {
            type: 'enum',
            enum: UserRole,
            default: UserRole.VOLUNTEER
        }
    )
    role: UserRole

    @Column()
    salt: string;

    // need a validation Password to test the password on name 
    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}