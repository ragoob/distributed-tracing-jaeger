import { Product } from '@core/domain/entities/product';
export type OrderResponse = {
    id: number;
    items: ReadonlyArray<OrderItem>;
    total: number;
}
export type OrderItem = {
    productId: number;
    quantity: number;
    product: Product | null;
}
export type OrderRequest = Omit<OrderResponse,"id" | "total">

export class Order {
    constructor(request: OrderRequest){
        this.id = this.newId();
        this.items= request.items;
       this.total =  this.items.map(item=> item.product!.price *  item.quantity).reduce((p,c)=> p + c);
    }
   private id: number;
   private  items: ReadonlyArray<OrderItem>
   private total: number;
    private newId(): number{
       return Math.floor(Math.random() * (300 - 1) + 1);
    }

    getId(): number{
        return this.id;
    }
    getTotal(): number{
      return this.total;
    }

    getItems(): ReadonlyArray<OrderItem>{
        return this.items;
    }
}