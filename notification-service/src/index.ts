import dotenv from 'dotenv'
dotenv.config();
import {init} from '../../tracer-lib/lib/tracer'
const {tracer} = init('notification-service','development',{ endpoint: process.env.JAEGER_END_POINT});
import server from './server';
import express from 'express';
import { RedisConfig } from '@infrastructure/config/redis.config';
import Redis  from 'ioredis';
import { ConsoleLogger } from './infrastructure/observability/logging/console-logger';
import { JaegerTracer } from '@infrastructure/observability/tracing/jaeger-tracer';

 function getRedisDataSource(): Redis{
  const redis = new Redis(RedisConfig.REDIS_CONNECTION_STRING);
  return redis;
}

 (async()=> {
  const redisClient = await getRedisDataSource();
  const logger = new ConsoleLogger();
  const jaegerTracer = new  JaegerTracer(tracer)
  server.expressInstance.use(express.json())
  server.registerEvents(jaegerTracer,logger,redisClient)
  server.listen(3050,()=> console.log("Running on http://localhost:3050"))
})();