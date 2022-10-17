import { Express } from 'express';
import express from 'express';
import * as http from 'http';
import { Redis } from 'ioredis';
import { ILogger } from './infrastructure/observability/logging/logger.interface';
import { ITracer } from '@infrastructure/observability/tracing/open-telemetry-tracer.interface';
import { ALL_EVENTS } from './core/events';
import * as api from '@opentelemetry/api';
export default class Server {
  public static expressInstance: Express = express();
  public static listen(port: number, callback?: () => void): http.Server {
    return this.expressInstance.listen(port, callback)
  }

  public static registerEvents(tracer: ITracer,logger: ILogger,redis: Redis) {
    redis.subscribe(...ALL_EVENTS, (err, data) => {
      if(err){
        logger.error(err);
      }
      redis.on("message", (channel: string, message: string) => {
          const payload = JSON.parse(message);
          const propagatedContext = api.propagation.extract(api.ROOT_CONTEXT, payload);
          const span = tracer.getRedisTracer().startSpan(`Consume event ${channel}`, {
              attributes: {
                  message,
              }
          }, propagatedContext); 
          span.end();
          logger.log(`Received ${message} from ${channel}`);
      });
  })
  }
}




