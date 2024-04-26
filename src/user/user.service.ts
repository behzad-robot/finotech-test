import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { ServiceError } from "../utils/service_error";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CheckTokenCommand, ConfirmEmailCommand, LoginCommand, LoginResponseDTO, SignupCommand, UserDTO } from "./user.dto";
import { arrayToDto, toDto } from "./user.entity.utils";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RedisService } from "../infrastructure/redis/redis.service";
import { EmailService } from "../infrastructure/email/email.service";
import { todo } from "node:test";

@Injectable()
export class UserService {
    private readonly USER_TOKEN_BASE = 'user-token-';
    private readonly USER_TOKEN_EXPIRES_AT = 60 * 60 * 24;
    private readonly USER_TOKEN_EXPIRES_AT_STRING = `24h`;

    constructor(@InjectRepository(User)
    private readonly usersRepository: Repository<User>,
        private readonly redisService: RedisService,
        private readonly emailService: EmailService,
    ) { }
    async getOne(id: number): Promise<UserDTO> {
        let user = await this.usersRepository.findOneBy({ id: id });
        if (user == undefined)
            throw new ServiceError(404, 'user not found');
        return toDto(user);
    }
    async signup(command: SignupCommand): Promise<UserDTO> {
        try {
            let hashedPassword = await this.hashPassword(command.password);
            let user = await this.usersRepository.save({
                firstName: command.firstName,
                lastName: command.lastName,
                email: command.email,
                password: hashedPassword,
                hasEmailConfirm: false,
            });
            //email setup:
            let jwtPayload = { id: user.id, email: user.email };
            let emailJwt = this.encodeJWTToken(jwtPayload);
            let emailLink = `http://localhost:3000/users/confirm-email/?token=${emailJwt}`;
            console.log(`emailLink=`, emailLink);
            await this.emailService.sendEmail({
                title: 'Please Confirm Your Email',
                body: 'Confirm Link:\n' + emailLink,
                cc: '',
                to: user.email,
            });
            //send response:
            return toDto(user);
        }
        catch (err) {
            throw new ServiceError(500, err.toString())
        }
    }
    async confirmEmail(command: ConfirmEmailCommand): Promise<boolean> {
        let payload = this.decodeJWTToken(command.token);
        if (payload == null)
            throw new ServiceError(400, 'Invalid or expired token');
        let hasFields = 'email' in payload && 'id' in payload;
        let user = await this.usersRepository.findOneBy({ id: payload.id });
        if (user == undefined)
            throw new ServiceError(404, 'User Not found');
        if (user.hasEmailConfirm)
            throw new ServiceError(403, 'Already Confirmed');
        user.hasEmailConfirm = true;
        await this.usersRepository.save(user);
        return true;
    }
    async login(command: LoginCommand): Promise<LoginResponseDTO> {
        let user = await this.usersRepository.findOneBy({ email: command.email });
        if (user == undefined)
            throw new ServiceError(404, 'User not found');
        if (!user.hasEmailConfirm)
            throw new ServiceError(403, 'Please Confirm Email First');
        let isOkPassword = await this.comparePasswords(command.password, user.password);
        if (!isOkPassword)
            throw new ServiceError(400, 'Wrong password');
        let token = this.encodeJWTToken(<UserTokenPayload>{ id: user.id }, this.USER_TOKEN_EXPIRES_AT_STRING);
        await this.redisService.client.setEx(this.USER_TOKEN_BASE + user.id, this.USER_TOKEN_EXPIRES_AT, user.id.toString());
        return {
            user: toDto(user),
            token: token,
        };
    }
    async checkToken(command: CheckTokenCommand): Promise<LoginResponseDTO> {
        let payload = this.decodeJWTToken(command.token) as UserTokenPayload;
        if (payload == undefined)
            throw new ServiceError(400, 'invalid token');
        let redisKeyContent = await this.redisService.client.get(this.USER_TOKEN_BASE + payload.id);
        if (redisKeyContent == undefined)
            throw new ServiceError(401, 'expired token');
        let user = await this.usersRepository.findOneBy({ id: payload.id });
        if (user == undefined)
            throw new ServiceError(404, 'user not found');
        return {
            token: command.token,
            user: toDto(user),
        };
    }
    //private functions:
    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10; // TODO: Number of salt rounds to use for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
    //TODO: fix this!
    private jwtSecret = 'secret'
    private encodeJWTToken(payload: any, expiresIn: string = '1h'): string {
        return jwt.sign(payload, this.jwtSecret, { expiresIn });
    }
    private decodeJWTToken(token: string): any {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            return decoded;
        }
        catch (err) {
            return null;
        }
    }
}
interface UserTokenPayload {
    id: number
}