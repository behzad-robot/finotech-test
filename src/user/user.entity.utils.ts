import { UserDTO } from "./user.dto";
import { User } from "./user.entity";
export function arrayToDto(input: User[]): UserDTO[] {
    return input.map(t => toDto(t) as UserDTO);
}
export function toDto(input: User): UserDTO {
    return {
        id: input.id,
        firstName: input.firstName,
        lastname: input.lastName,
        hasEmailConfirm: input.hasEmailConfirm,
    };
}