jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BasketService } from '../service/basket.service';
import { IBasket, Basket } from '../basket.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

import { BasketUpdateComponent } from './basket-update.component';

describe('Component Tests', () => {
  describe('Basket Management Update Component', () => {
    let comp: BasketUpdateComponent;
    let fixture: ComponentFixture<BasketUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let basketService: BasketService;
    let userService: UserService;
    let courseService: CourseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BasketUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BasketUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BasketUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      basketService = TestBed.inject(BasketService);
      userService = TestBed.inject(UserService);
      courseService = TestBed.inject(CourseService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const basket: IBasket = { id: 456 };
        const user: IUser = { id: 27699 };
        basket.user = user;
        const customer: IUser = { id: 87926 };
        basket.customer = customer;

        const userCollection: IUser[] = [{ id: 47918 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user, customer];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ basket });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call course query and add missing value', () => {
        const basket: IBasket = { id: 456 };
        const course: ICourse = { id: 13045 };
        basket.course = course;

        const courseCollection: ICourse[] = [{ id: 11803 }];
        spyOn(courseService, 'query').and.returnValue(of(new HttpResponse({ body: courseCollection })));
        const expectedCollection: ICourse[] = [course, ...courseCollection];
        spyOn(courseService, 'addCourseToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ basket });
        comp.ngOnInit();

        expect(courseService.query).toHaveBeenCalled();
        expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(courseCollection, course);
        expect(comp.coursesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const basket: IBasket = { id: 456 };
        const user: IUser = { id: 13820 };
        basket.user = user;
        const customer: IUser = { id: 8136 };
        basket.customer = customer;
        const course: ICourse = { id: 79009 };
        basket.course = course;

        activatedRoute.data = of({ basket });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(basket));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.usersSharedCollection).toContain(customer);
        expect(comp.coursesCollection).toContain(course);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const basket = { id: 123 };
        spyOn(basketService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ basket });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: basket }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(basketService.update).toHaveBeenCalledWith(basket);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const basket = new Basket();
        spyOn(basketService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ basket });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: basket }));
        saveSubject.complete();

        // THEN
        expect(basketService.create).toHaveBeenCalledWith(basket);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const basket = { id: 123 };
        spyOn(basketService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ basket });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(basketService.update).toHaveBeenCalledWith(basket);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCourseById', () => {
        it('Should return tracked Course primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCourseById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
