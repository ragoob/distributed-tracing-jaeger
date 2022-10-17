import { createOrder } from '@core/user-cases/order/create-usecase';
import { ProductRepository } from '@infrastructure/repositories/product/product.repository';
import { Express } from 'express';
import express from 'express';
import * as http from 'http';
import { ILogger } from '@infrastructure/observability/logging/logger.interface';
import { ITracer } from '@infrastructure/observability/tracing/open-telemetry-tracer.interface';
import { Tracer } from '@opentelemetry/api';
import axios from 'axios';
import { JaegerTracer } from '@infrastructure/observability/tracing/jaeger-tracer';
import { ConsoleLogger } from '@infrastructure/observability/logging/console-logger';
import OrderRouter from '@presentation/routers/order.router';
import { OrderRepository } from '@infrastructure/repositories/order/order.repository';
import { Redis } from 'ioredis';
import { OrderCreatedEventHandler } from './infrastructure/event-handlers/order/order-created.handler';
export default class Server {
  public static expressInstance: Express = express();
  public static listen(port: number, callback?: () => void): http.Server {
    return this.expressInstance.listen(port, callback)
  }

  public static registerRouters(tracer: Tracer,redis: Redis) {
    const jaegerTracer: ITracer  = new JaegerTracer(tracer);
    const logger: ILogger = new ConsoleLogger();
    const orderMiddleWare = OrderRouter(
      new createOrder(new ProductRepository(axios), new OrderRepository(redis)
      ,new OrderCreatedEventHandler(redis)
      ,logger,jaegerTracer),
      jaegerTracer,
      logger
    );
    this.expressInstance.use('/orders', orderMiddleWare);
  }
}




