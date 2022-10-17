import { createOrderUseCase } from '@core/interfaces/use-cases/order/create-order.usecase';
import { OrderResponse } from '@core/domain/entities/order';
import { OrderRequest } from '@core/domain/entities/order';
import { Order } from '@core/domain/entities/order';
import { IOrderRepository } from '@core/interfaces/repositories/order/order.repository.interface';
import { IProductRepository } from "@core/interfaces/repositories/product/product.repository.interface";
import * as api from '@opentelemetry/api';
import { ILogger } from '@infrastructure/observability/logging/logger.interface';
import { ITracer } from '@infrastructure/observability/tracing/open-telemetry-tracer.interface';
import { IDomainEventHandler } from '../../interfaces/domain-event.handler';
import { OrderCreated } from '@core/domain/events/order/order-created';

export class createOrder implements createOrderUseCase{
   private readonly productRepository: IProductRepository;
   private readonly orderRepository: IOrderRepository;
   private readonly orderEventHandler: IDomainEventHandler<OrderCreated>
   private readonly logger: ILogger;
   private readonly tracer: ITracer;
    constructor(productRepository: IProductRepository,orderRepository: IOrderRepository, orderEventHandler: IDomainEventHandler<OrderCreated>, logger: ILogger , tracer: ITracer){
     this.productRepository = productRepository;
     this.orderRepository = orderRepository;
     this.orderEventHandler = orderEventHandler;
     this.logger = logger;
     this.tracer = tracer;
     
    }
   async excute(request: OrderRequest): Promise<OrderResponse | null> {
     try {
      const products = await this.productRepository.get();
      if(!products || products.length == 0)
      return null;
      
      request.items.forEach(p=> p.product = products.find(c=> c.id == p.productId)!)
      const order = new Order(request);
      await this.orderRepository.create(order);
      const orderCreated = {
         id: order.getId(),
         order: order
      };
      const activeSpan = this.tracer.getActiveSpan();
      api.propagation.inject(api.trace.setSpan(api.context.active(), activeSpan!), orderCreated);
      this.orderEventHandler.handle(orderCreated);
      const response: OrderResponse = {
         id: order.getId(),
         items: order.getItems(),
         total: order.getTotal()
      }
      return response;
     } catch (error) {
      this.logger.error(error);
      throw error;
     }
   }
     
}