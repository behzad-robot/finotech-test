import { Injectable } from "@nestjs/common";
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisService {
    public readonly client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL,
        })
        this.client.connect();
    }
}