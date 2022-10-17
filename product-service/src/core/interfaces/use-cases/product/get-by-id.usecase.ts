import { Product } from "@core/domain/entities/product";

export interface GetProductByIdUseCase {
    excute(id: number): Promise<Product | null>
}