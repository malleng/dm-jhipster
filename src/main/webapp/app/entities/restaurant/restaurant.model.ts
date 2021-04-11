import { ICooperative } from 'app/entities/cooperative/cooperative.model';

export interface IRestaurant {
  id?: number;
  restaurantId?: number;
  name?: string;
  description?: string | null;
  cooperatives?: ICooperative[] | null;
}

export class Restaurant implements IRestaurant {
  constructor(
    public id?: number,
    public restaurantId?: number,
    public name?: string,
    public description?: string | null,
    public cooperatives?: ICooperative[] | null
  ) {}
}

export function getRestaurantIdentifier(restaurant: IRestaurant): number | undefined {
  return restaurant.id;
}
