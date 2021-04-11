jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBasket, Basket } from '../basket.model';
import { BasketService } from '../service/basket.service';

import { BasketRoutingResolveService } from './basket-routing-resolve.service';

describe('Service Tests', () => {
  describe('Basket routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BasketRoutingResolveService;
    let service: BasketService;
    let resultBasket: IBasket | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BasketRoutingResolveService);
      service = TestBed.inject(BasketService);
      resultBasket = undefined;
    });

    describe('resolve', () => {
      it('should return IBasket returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBasket = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBasket).toEqual({ id: 123 });
      });

      it('should return new IBasket if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBasket = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBasket).toEqual(new Basket());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBasket = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBasket).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
