import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RedisModule } from "../infrastructure/redis/redis.module";
import { EmailModule } from "../infrastructure/email/email.module";
import { AuthGuard } from "./auth.guard";

@Module({
    imports: [TypeOrmModule.forFeature([User]), RedisModule, EmailModule],
    controllers: [UserController],
    providers: [UserService, AuthGuard],
    exports: [UserService, AuthGuard],
})
export class UserModule { }