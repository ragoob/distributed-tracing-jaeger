import { Product } from "@core/domain/entities/product";

export interface GetProductsUseCase{
    excute(): Promise<Product[]>;
}