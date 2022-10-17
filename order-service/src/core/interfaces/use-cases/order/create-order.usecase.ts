import { OrderRequest,OrderResponse } from '@core/domain/entities/order';

export interface createOrderUseCase {
    excute(request: OrderRequest): Promise<OrderResponse | null>
}