import { Product } from "@core/domain/entities/product";
import { GetProductsUseCase } from "@core/interfaces/use-cases/product/get.usecase";
import { ProductRepository } from "@infrastructure/repositories/product.repository";

export class GetProducts implements GetProductsUseCase{
    private readonly productRepository: ProductRepository;
     constructor(productRepository: ProductRepository){
      this.productRepository = productRepository;
     }
     excute(): Promise<Product[]> {
        return this.productRepository.get();
     }
  
 }