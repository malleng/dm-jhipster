import { IUser } from 'app/entities/user/user.model';
import { ICourse } from 'app/entities/course/course.model';
import { BasketState } from 'app/entities/enumerations/basket-state.model';

export interface IBasket {
  id?: number;
  basketId?: number;
  basketState?: BasketState;
  user?: IUser | null;
  course?: ICourse | null;
  customer?: IUser | null;
}

export class Basket implements IBasket {
  constructor(
    public id?: number,
    public basketId?: number,
    public basketState?: BasketState,
    public user?: IUser | null,
    public course?: ICourse | null,
    public customer?: IUser | null
  ) {}
}

export function getBasketIdentifier(basket: IBasket): number | undefined {
  return basket.id;
}
