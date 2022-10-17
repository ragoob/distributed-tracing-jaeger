import dotenv from 'dotenv'
dotenv.config();
import {init} from '../../tracer-lib/lib/tracer'
const {tracer} = init('order-service','development',{ endpoint: process.env.JAEGER_END_POINT});
import server from './server';
import express from 'express';
import { RedisConfig } from '@infrastructure/config/redis.config';
import Redis  from 'ioredis';
import { JaegerTracer } from '@infrastructure/observability/tracing/jaeger-tracer';

 function getRedisDataSource(): Redis{
  const redis = new Redis(RedisConfig.REDIS_PORT,RedisConfig.REDIS_HOST, {
    timeout: RedisConfig.REDIS_TIMEOUT,
    enableOfflineQueue: false
  });

  redis.on('error',(error)=> {
    console.log(error)
    new JaegerTracer(tracer).recordException(error)
  })
  return redis;
}

 (async()=> {
  const redisClient = await getRedisDataSource();
  server.expressInstance.use(express.json())
  server.registerRouters(tracer,redisClient)
  server.listen(3000,()=> console.log("Running on http://localhost:3000"))
})();