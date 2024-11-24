import { BadRequestException, PipeTransform } from "@nestjs/common";
import { UserRole } from "../user/user-role.enum";

export class UserRoleValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        UserRole.ADMIN,
        UserRole.COORDONATOR,
        UserRole.SUBCOORDONATOR,
        UserRole.PROFESSOR,
        UserRole.VOLUNTEER
    ]

    transform(value: any) {
        value = value.toUpperCase()

        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status!`)
        }
    }

    private isStatusValid(role: string) {
        return this.allowedStatus.includes(role as UserRole);
    }
}