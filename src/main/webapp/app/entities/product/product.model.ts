import { IBasket } from 'app/entities/basket/basket.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { Disponibility } from 'app/entities/enumerations/disponibility.model';

export interface IProduct {
  id?: number;
  price?: number;
  disponibility?: Disponibility | null;
  description?: string | null;
  basket?: IBasket | null;
  restaurant?: IRestaurant | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public price?: number,
    public disponibility?: Disponibility | null,
    public description?: string | null,
    public basket?: IBasket | null,
    public restaurant?: IRestaurant | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
