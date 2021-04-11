import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BasketState } from 'app/entities/enumerations/basket-state.model';
import { IBasket, Basket } from '../basket.model';

import { BasketService } from './basket.service';

describe('Service Tests', () => {
  describe('Basket Service', () => {
    let service: BasketService;
    let httpMock: HttpTestingController;
    let elemDefault: IBasket;
    let expectedResult: IBasket | IBasket[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BasketService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        basketId: 0,
        basketState: BasketState.NOTFINISHED,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Basket', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Basket()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Basket', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            basketId: 1,
            basketState: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Basket', () => {
        const patchObject = Object.assign(
          {
            basketId: 1,
          },
          new Basket()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Basket', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            basketId: 1,
            basketState: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Basket', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBasketToCollectionIfMissing', () => {
        it('should add a Basket to an empty array', () => {
          const basket: IBasket = { id: 123 };
          expectedResult = service.addBasketToCollectionIfMissing([], basket);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(basket);
        });

        it('should not add a Basket to an array that contains it', () => {
          const basket: IBasket = { id: 123 };
          const basketCollection: IBasket[] = [
            {
              ...basket,
            },
            { id: 456 },
          ];
          expectedResult = service.addBasketToCollectionIfMissing(basketCollection, basket);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Basket to an array that doesn't contain it", () => {
          const basket: IBasket = { id: 123 };
          const basketCollection: IBasket[] = [{ id: 456 }];
          expectedResult = service.addBasketToCollectionIfMissing(basketCollection, basket);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(basket);
        });

        it('should add only unique Basket to an array', () => {
          const basketArray: IBasket[] = [{ id: 123 }, { id: 456 }, { id: 37011 }];
          const basketCollection: IBasket[] = [{ id: 123 }];
          expectedResult = service.addBasketToCollectionIfMissing(basketCollection, ...basketArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const basket: IBasket = { id: 123 };
          const basket2: IBasket = { id: 456 };
          expectedResult = service.addBasketToCollectionIfMissing([], basket, basket2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(basket);
          expect(expectedResult).toContain(basket2);
        });

        it('should accept null and undefined values', () => {
          const basket: IBasket = { id: 123 };
          expectedResult = service.addBasketToCollectionIfMissing([], null, basket, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(basket);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
