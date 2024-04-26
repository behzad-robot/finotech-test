import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CheckTokenCommand, LoginCommand, SignupCommand, UserDTO } from "./user.dto";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post('/signup')
    async signup(@Body() command: SignupCommand): Promise<any> {
        return await this.userService.signup(command);
    }
    @Get('/confirm-email')
    async confirmEmail(@Query('token') token: string): Promise<any> {
        return { success: await this.userService.confirmEmail({ token: token }) };
    }
    @Post('/login')
    async login(@Body() command: LoginCommand): Promise<any> {
        return await this.userService.login(command);
    }
    @Post('/check-token')
    async checkToken(@Body() command: CheckTokenCommand): Promise<any> {
        return await this.userService.checkToken(command);
    }
}