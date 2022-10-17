import { get } from 'env-var';
export class ApiConfig {
    public static readonly PRODUCT_API_URL: string = get('PRODUCT_API_URL').required().asString();

}