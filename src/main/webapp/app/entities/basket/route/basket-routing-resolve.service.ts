import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBasket, Basket } from '../basket.model';
import { BasketService } from '../service/basket.service';

@Injectable({ providedIn: 'root' })
export class BasketRoutingResolveService implements Resolve<IBasket> {
  constructor(protected service: BasketService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBasket> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((basket: HttpResponse<Basket>) => {
          if (basket.body) {
            return of(basket.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Basket());
  }
}
