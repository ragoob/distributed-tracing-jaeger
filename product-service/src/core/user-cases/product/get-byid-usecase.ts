import { Product } from "@core/domain/entities/product";
import { GetProductByIdUseCase } from "@core/interfaces/use-cases/product/get-by-id.usecase";
import { ProductRepository } from "@infrastructure/repositories/product.repository";

export class GetProductById implements GetProductByIdUseCase{
   private readonly productRepository: ProductRepository;
    constructor(productRepository: ProductRepository){
     this.productRepository = productRepository;
    }
    excute(id: number): Promise<Product | null> {
       return this.productRepository.getById(id);
    }
 
}