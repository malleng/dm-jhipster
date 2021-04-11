import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBasket, getBasketIdentifier } from '../basket.model';

export type EntityResponseType = HttpResponse<IBasket>;
export type EntityArrayResponseType = HttpResponse<IBasket[]>;

@Injectable({ providedIn: 'root' })
export class BasketService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/baskets');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(basket: IBasket): Observable<EntityResponseType> {
    return this.http.post<IBasket>(this.resourceUrl, basket, { observe: 'response' });
  }

  update(basket: IBasket): Observable<EntityResponseType> {
    return this.http.put<IBasket>(`${this.resourceUrl}/${getBasketIdentifier(basket) as number}`, basket, { observe: 'response' });
  }

  partialUpdate(basket: IBasket): Observable<EntityResponseType> {
    return this.http.patch<IBasket>(`${this.resourceUrl}/${getBasketIdentifier(basket) as number}`, basket, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBasket>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBasket[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBasketToCollectionIfMissing(basketCollection: IBasket[], ...basketsToCheck: (IBasket | null | undefined)[]): IBasket[] {
    const baskets: IBasket[] = basketsToCheck.filter(isPresent);
    if (baskets.length > 0) {
      const basketCollectionIdentifiers = basketCollection.map(basketItem => getBasketIdentifier(basketItem)!);
      const basketsToAdd = baskets.filter(basketItem => {
        const basketIdentifier = getBasketIdentifier(basketItem);
        if (basketIdentifier == null || basketCollectionIdentifiers.includes(basketIdentifier)) {
          return false;
        }
        basketCollectionIdentifiers.push(basketIdentifier);
        return true;
      });
      return [...basketsToAdd, ...basketCollection];
    }
    return basketCollection;
  }
}
