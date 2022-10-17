import { Product } from "@core/domain/entities/product";

export interface IProductRepository{
    getById(id: number): Promise<Product | null>;
    get(): Promise<Array<Product>>;
}