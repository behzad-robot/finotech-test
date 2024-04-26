import { IsEmail, IsNotEmpty } from "class-validator"

export interface UserDTO {
    id: number,
    firstName: string,
    lastname: string,
    hasEmailConfirm: boolean,
}
export class SignupCommand {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;
    
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
export class LoginCommand {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}
export interface LoginResponseDTO {
    user: UserDTO,
    token: string,
}
export class CheckTokenCommand {
    @IsNotEmpty()
    token: string;
}
export class ConfirmEmailCommand {
    @IsNotEmpty()
    token: string;
}