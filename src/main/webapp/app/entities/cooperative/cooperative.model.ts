import { IRestaurant } from 'app/entities/restaurant/restaurant.model';

export interface ICooperative {
  id?: number;
  cooperativeId?: number;
  name?: string | null;
  area?: string | null;
  restaurants?: IRestaurant[] | null;
}

export class Cooperative implements ICooperative {
  constructor(
    public id?: number,
    public cooperativeId?: number,
    public name?: string | null,
    public area?: string | null,
    public restaurants?: IRestaurant[] | null
  ) {}
}

export function getCooperativeIdentifier(cooperative: ICooperative): number | undefined {
  return cooperative.id;
}
