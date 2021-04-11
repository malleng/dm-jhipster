import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICourse, Course } from '../course.model';
import { CourseService } from '../service/course.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
})
export class CourseUpdateComponent implements OnInit {
  isSaving = false;

  restaurantsSharedCollection: IRestaurant[] = [];

  editForm = this.fb.group({
    id: [],
    state: [null, [Validators.required]],
    deliveryTime: [null, [Validators.required]],
    restaurant: [],
  });

  constructor(
    protected courseService: CourseService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      if (course.id === undefined) {
        const today = dayjs().startOf('day');
        course.deliveryTime = today;
      }

      this.updateForm(course);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const course = this.createFromForm();
    if (course.id !== undefined) {
      this.subscribeToSaveResponse(this.courseService.update(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(course));
    }
  }

  trackRestaurantById(index: number, item: IRestaurant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(course: ICourse): void {
    this.editForm.patchValue({
      id: course.id,
      state: course.state,
      deliveryTime: course.deliveryTime ? course.deliveryTime.format(DATE_TIME_FORMAT) : null,
      restaurant: course.restaurant,
    });

    this.restaurantsSharedCollection = this.restaurantService.addRestaurantToCollectionIfMissing(
      this.restaurantsSharedCollection,
      course.restaurant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.restaurantService
      .query()
      .pipe(map((res: HttpResponse<IRestaurant[]>) => res.body ?? []))
      .pipe(
        map((restaurants: IRestaurant[]) =>
          this.restaurantService.addRestaurantToCollectionIfMissing(restaurants, this.editForm.get('restaurant')!.value)
        )
      )
      .subscribe((restaurants: IRestaurant[]) => (this.restaurantsSharedCollection = restaurants));
  }

  protected createFromForm(): ICourse {
    return {
      ...new Course(),
      id: this.editForm.get(['id'])!.value,
      state: this.editForm.get(['state'])!.value,
      deliveryTime: this.editForm.get(['deliveryTime'])!.value
        ? dayjs(this.editForm.get(['deliveryTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      restaurant: this.editForm.get(['restaurant'])!.value,
    };
  }
}
