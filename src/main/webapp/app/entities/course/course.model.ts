import * as dayjs from 'dayjs';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { IBasket } from 'app/entities/basket/basket.model';
import { CourseState } from 'app/entities/enumerations/course-state.model';

export interface ICourse {
  id?: number;
  state?: CourseState;
  deliveryTime?: dayjs.Dayjs;
  restaurant?: IRestaurant | null;
  basket?: IBasket | null;
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public state?: CourseState,
    public deliveryTime?: dayjs.Dayjs,
    public restaurant?: IRestaurant | null,
    public basket?: IBasket | null
  ) {}
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
