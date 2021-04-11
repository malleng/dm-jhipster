jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CooperativeService } from '../service/cooperative.service';
import { ICooperative, Cooperative } from '../cooperative.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

import { CooperativeUpdateComponent } from './cooperative-update.component';

describe('Component Tests', () => {
  describe('Cooperative Management Update Component', () => {
    let comp: CooperativeUpdateComponent;
    let fixture: ComponentFixture<CooperativeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cooperativeService: CooperativeService;
    let restaurantService: RestaurantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CooperativeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CooperativeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CooperativeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cooperativeService = TestBed.inject(CooperativeService);
      restaurantService = TestBed.inject(RestaurantService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Restaurant query and add missing value', () => {
        const cooperative: ICooperative = { id: 456 };
        const restaurants: IRestaurant[] = [{ id: 85868 }];
        cooperative.restaurants = restaurants;

        const restaurantCollection: IRestaurant[] = [{ id: 67008 }];
        spyOn(restaurantService, 'query').and.returnValue(of(new HttpResponse({ body: restaurantCollection })));
        const additionalRestaurants = [...restaurants];
        const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
        spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ cooperative });
        comp.ngOnInit();

        expect(restaurantService.query).toHaveBeenCalled();
        expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(restaurantCollection, ...additionalRestaurants);
        expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const cooperative: ICooperative = { id: 456 };
        const restaurants: IRestaurant = { id: 42003 };
        cooperative.restaurants = [restaurants];

        activatedRoute.data = of({ cooperative });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cooperative));
        expect(comp.restaurantsSharedCollection).toContain(restaurants);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cooperative = { id: 123 };
        spyOn(cooperativeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cooperative });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cooperative }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cooperativeService.update).toHaveBeenCalledWith(cooperative);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cooperative = new Cooperative();
        spyOn(cooperativeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cooperative });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cooperative }));
        saveSubject.complete();

        // THEN
        expect(cooperativeService.create).toHaveBeenCalledWith(cooperative);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cooperative = { id: 123 };
        spyOn(cooperativeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cooperative });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cooperativeService.update).toHaveBeenCalledWith(cooperative);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRestaurantById', () => {
        it('Should return tracked Restaurant primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRestaurantById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedRestaurant', () => {
        it('Should return option if no Restaurant is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedRestaurant(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Restaurant for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedRestaurant(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Restaurant is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedRestaurant(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
