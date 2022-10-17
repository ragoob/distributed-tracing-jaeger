import { Order } from '@core/domain/entities/order';
export interface IOrderRepository{
  create(order: Order): Promise<Order>;
  getById(id: number): Promise<Order | null>;
}