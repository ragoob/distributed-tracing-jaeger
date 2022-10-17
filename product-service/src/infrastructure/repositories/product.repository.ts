import { Product } from '@core/domain/entities/product';
import { IProductRepository } from "@core/interfaces/repositories/product/product.repository.interface";
import { Pool } from 'pg';

export class ProductRepository implements IProductRepository {
    private readonly db: Pool;
    constructor(db: Pool) {
        this.db = db;
    }
    async get(): Promise<Product[]> {
        const queryResult = await this.db
            .query('SELECT id,name,price,is_active  FROM product WHERE is_active=true');
            const result: Product[] = queryResult.rows.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                isActive: item.is_active
    
            }));

            return result;
            
    }
    async getById(id: number): Promise<Product | null> {
        const queryResult = await this.db
            .query('SELECT id,name,price,is_active  FROM product WHERE id =$1', [id]);
        const result: Product[] = queryResult.rows.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            isActive: item.is_active

        }));
        return result[0];
    }

}