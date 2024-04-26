import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from 'express';
import { ServiceError } from "../utils/service_error";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        // console.log('guard is happening', token);
        if (!token) {
            throw new ServiceError(400, 'access denied')
        }
        let result = await this.userService.checkToken({ token });
        if (result == undefined) {
            throw new ServiceError(400, 'access denied');
        }
        request['user'] = result.user;
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
} 