import { get } from "env-var";

export class RedisConfig{
    public static readonly REDIS_CONNECTION_STRING : string = get('REDIS_CONNECTION_STRING').required().asString();

}