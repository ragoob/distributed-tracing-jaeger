import { Order } from '@core/domain/entities/order';
import { IOrderRepository } from '@core/interfaces/repositories/order/order.repository.interface';
import { Redis } from 'ioredis';


export class OrderRepository implements IOrderRepository{
    private readonly redisClient: Redis;
    constructor(redisClient: Redis){
      this.redisClient = redisClient;
    }
   async create(order: Order): Promise<Order> {
       await this.redisClient.set(order.getId().toString(),JSON.stringify(order));
        return order;
    }
    async getById(id: number): Promise<Order | null> {
        const redisResponse = await this.redisClient.get(id.toString());
        if(!redisResponse)
        return null
        return JSON.parse(redisResponse);
    }
  
}