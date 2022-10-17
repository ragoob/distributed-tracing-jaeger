import { Axios } from "axios";
import { IProductRepository } from '@core/interfaces/repositories/product/product.repository.interface';
import { Product } from "@core/domain/entities/product";
import { ApiConfig } from '@infrastructure/config/api.config';

export class ProductRepository implements IProductRepository {
  private readonly http: Axios;
  constructor(http: Axios) {
    this.http = http;
  }
  async getById(id: number): Promise<Product | null> {
    const result = await this.http.get<Product>(`${ApiConfig.PRODUCT_API_URL}/${id}`);
    return result.data
  }

  async get(): Promise<Product[]> {
    const result = await this.http.get<Product[]>(`${ApiConfig.PRODUCT_API_URL}`);
    return result.data
  }


}