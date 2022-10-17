import dotenv from 'dotenv'
dotenv.config();
import {init} from '../../tracer-lib/lib/tracer'
const {tracer} = init('product-service','development',{ endpoint: process.env.JAEGER_END_POINT});
import { Pool } from 'pg';
import server from './server';
import { ILogger } from './infrastructure/observability/logging/logger.interface';
import { ConsoleLogger } from './infrastructure/observability/logging/console-logger';
import { ITracer } from '@infrastructure/observability/tracing/open-telemetry-tracer.interface';
import { JaegerTracer } from './infrastructure/observability/tracing/jaeger-tracer';
import { DataBaseConfig } from './infrastructure/config/db.config';

function getPgDataSource(): Pool{
  const db = new Pool({
    user: DataBaseConfig.DB_USERNAME,
    password: DataBaseConfig.DB_PASSWORD,
    host: DataBaseConfig.DB_HOST,
    database: DataBaseConfig.DB_NAME
  });
  return db;
}

(()=> {
  const dataSource = getPgDataSource();
  const jaegerTracer: ITracer  = new JaegerTracer(tracer);
  const logger: ILogger = new ConsoleLogger();
  server.registerRouters(dataSource,jaegerTracer,logger)
  server.listen(3010,()=> console.log("Running on http://localhost:3010"))
})();