import { GetProductById } from '@core/user-cases/product/get-byid-usecase';
import { ProductRepository } from '@infrastructure/repositories/product.repository';
import ProductRouter from '@presentation/routers/product.router';
import { Express } from 'express';
import express from 'express';
import { Pool } from 'pg';
import * as http from 'http';
import { ILogger } from '@infrastructure/observability/logging/logger.interface';
import { ITracer } from '@infrastructure/observability/tracing/open-telemetry-tracer.interface';
import { GetProducts } from '@core/user-cases/product/get-usecase';
export default class Server {
  public static expressInstance: Express = express();
  public static listen(port: number, callback?: () => void): http.Server {
    return this.expressInstance.listen(port, callback)
  }

  public static registerRouters(dataSource: Pool,tracer: ITracer, logger: ILogger) {
    const repoistory = new ProductRepository(dataSource);
    const productMiddleWare = ProductRouter(
      new GetProductById(repoistory),
      new GetProducts(repoistory),
      tracer,
      logger
    );
    this.expressInstance.use('/products', productMiddleWare);
  }
}




