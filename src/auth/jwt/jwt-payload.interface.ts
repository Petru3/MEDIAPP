import { UserRole } from "../user/user-role.enum";
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}