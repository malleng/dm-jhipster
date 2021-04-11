jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductService } from '../service/product.service';
import { IProduct, Product } from '../product.model';
import { IBasket } from 'app/entities/basket/basket.model';
import { BasketService } from 'app/entities/basket/service/basket.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

import { ProductUpdateComponent } from './product-update.component';

describe('Component Tests', () => {
  describe('Product Management Update Component', () => {
    let comp: ProductUpdateComponent;
    let fixture: ComponentFixture<ProductUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let productService: ProductService;
    let basketService: BasketService;
    let restaurantService: RestaurantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProductUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      productService = TestBed.inject(ProductService);
      basketService = TestBed.inject(BasketService);
      restaurantService = TestBed.inject(RestaurantService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Basket query and add missing value', () => {
        const product: IProduct = { id: 456 };
        const basket: IBasket = { id: 78231 };
        product.basket = basket;

        const basketCollection: IBasket[] = [{ id: 77891 }];
        spyOn(basketService, 'query').and.returnValue(of(new HttpResponse({ body: basketCollection })));
        const additionalBaskets = [basket];
        const expectedCollection: IBasket[] = [...additionalBaskets, ...basketCollection];
        spyOn(basketService, 'addBasketToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(basketService.query).toHaveBeenCalled();
        expect(basketService.addBasketToCollectionIfMissing).toHaveBeenCalledWith(basketCollection, ...additionalBaskets);
        expect(comp.basketsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Restaurant query and add missing value', () => {
        const product: IProduct = { id: 456 };
        const restaurant: IRestaurant = { id: 12855 };
        product.restaurant = restaurant;

        const restaurantCollection: IRestaurant[] = [{ id: 31271 }];
        spyOn(restaurantService, 'query').and.returnValue(of(new HttpResponse({ body: restaurantCollection })));
        const additionalRestaurants = [restaurant];
        const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
        spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(restaurantService.query).toHaveBeenCalled();
        expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(restaurantCollection, ...additionalRestaurants);
        expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const product: IProduct = { id: 456 };
        const basket: IBasket = { id: 21457 };
        product.basket = basket;
        const restaurant: IRestaurant = { id: 80141 };
        product.restaurant = restaurant;

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(product));
        expect(comp.basketsSharedCollection).toContain(basket);
        expect(comp.restaurantsSharedCollection).toContain(restaurant);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = { id: 123 };
        spyOn(productService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: product }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(productService.update).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = new Product();
        spyOn(productService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: product }));
        saveSubject.complete();

        // THEN
        expect(productService.create).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = { id: 123 };
        spyOn(productService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(productService.update).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBasketById', () => {
        it('Should return tracked Basket primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBasketById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackRestaurantById', () => {
        it('Should return tracked Restaurant primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRestaurantById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
