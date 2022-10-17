import { TracingEvents } from "@infrastructure/config/tracing-events";
import { ITracer } from "@infrastructure/observability/tracing/open-telemetry-tracer.interface";
import express from 'express'
import { Router } from "express";
import { Request, Response } from 'express'
import { ILogger } from '@infrastructure/observability/logging/logger.interface';
import { createOrderUseCase } from '@core/interfaces/use-cases/order/create-order.usecase';

export default function OrderRouter(
   createOrderUseCase: createOrderUseCase,
    tracer: ITracer,
    logger: ILogger
): Router {
    const router = express.Router();
    router.post('/', async (req: Request, res: Response) => {
        try {
            tracer.addEvent(TracingEvents.POST_NEW_ORDER)
            const Order = await createOrderUseCase.excute(req.body);
            res.send(Order);
        } catch (error) {
            tracer.recordException(error);
            logger.error('error',{traceId: tracer.getTraceId()});
            res.status(500).send({ message: "Error creating order" })
        }
    })

    return router;
}