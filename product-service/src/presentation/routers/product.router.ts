import { GetProductByIdUseCase } from "@core/interfaces/use-cases/product/get-by-id.usecase";
import { TracingEvents } from "@infrastructure/config/tracing-events";
import { ITracer } from "@infrastructure/observability/tracing/open-telemetry-tracer.interface";
import express from 'express'
import { Router } from "express";
import { Request, Response } from 'express'
import { ILogger } from '@infrastructure/observability/logging/logger.interface';
import { AppConfig } from '@infrastructure/config/app.config';
import { RandomError } from '@utils/randomize-error';
import { GetProductsUseCase } from '@core/interfaces/use-cases/product/get.usecase';

export default function ProductRouter(
    getProductByIdUseCase: GetProductByIdUseCase,
    getProducts: GetProductsUseCase,
    tracer: ITracer,
    logger: ILogger
): Router {
    const router = express.Router();
    router.get('/:id', async (req: Request, res: Response) => {
        try {
            if(AppConfig.FUAULTY) {
              RandomError.throw();
            }
            tracer.addEvent(TracingEvents.GET_SIGNLE_PRODUCT, { productId: req.params.id })
            const product = await getProductByIdUseCase.excute(parseInt(req.params.id));
            res.send(product);
        } catch (error) {
            tracer.recordException(error);
            logger.error(error,{traceId: tracer.getTraceId()});
            res.status(500).send({ message: "Error fetching data" })
        }
    })

    router.get('/', async (req: Request, res: Response) => {
        try {
            if(AppConfig.FUAULTY) {
              RandomError.throw();
            }
            tracer.addEvent(TracingEvents.GET_PRODUCTS)
            const products = await getProducts.excute();
            res.send(products);
        } catch (error) {
            tracer.recordException(error);
            logger.error(error,{traceId: tracer.getTraceId()});
            res.status(500).send({ message: "Error fetching data" })
        }
    })

    return router;
}