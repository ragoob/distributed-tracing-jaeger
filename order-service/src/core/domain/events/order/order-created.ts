import { Order } from '@core/domain/entities/order';
export type OrderCreated  = {
  id: number;
  order: Order
}