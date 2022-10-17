import { IDomainEventHandler } from '@core/interfaces/domain-event.handler';
import { OrderCreated } from '@core/domain/events/order/order-created';
import Redis from 'ioredis';
export class OrderCreatedEventHandler implements IDomainEventHandler<OrderCreated>{
    private readonly redisClient: Redis;
    constructor(redisClient: Redis){
        this.redisClient = redisClient;
    }
    handle(event: OrderCreated): void {
        this.redisClient.publish('Order-created',JSON.stringify(event));
    }

}