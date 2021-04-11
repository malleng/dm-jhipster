import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBasket, Basket } from '../basket.model';
import { BasketService } from '../service/basket.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

@Component({
  selector: 'jhi-basket-update',
  templateUrl: './basket-update.component.html',
})
export class BasketUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  coursesCollection: ICourse[] = [];

  editForm = this.fb.group({
    id: [],
    basketId: [null, [Validators.required]],
    basketState: [null, [Validators.required]],
    user: [],
    course: [],
    customer: [],
  });

  constructor(
    protected basketService: BasketService,
    protected userService: UserService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ basket }) => {
      this.updateForm(basket);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const basket = this.createFromForm();
    if (basket.id !== undefined) {
      this.subscribeToSaveResponse(this.basketService.update(basket));
    } else {
      this.subscribeToSaveResponse(this.basketService.create(basket));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackCourseById(index: number, item: ICourse): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBasket>>): void {
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

  protected updateForm(basket: IBasket): void {
    this.editForm.patchValue({
      id: basket.id,
      basketId: basket.basketId,
      basketState: basket.basketState,
      user: basket.user,
      course: basket.course,
      customer: basket.customer,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, basket.user, basket.customer);
    this.coursesCollection = this.courseService.addCourseToCollectionIfMissing(this.coursesCollection, basket.course);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.courseService
      .query({ filter: 'basket-is-null' })
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing(courses, this.editForm.get('course')!.value)))
      .subscribe((courses: ICourse[]) => (this.coursesCollection = courses));
  }

  protected createFromForm(): IBasket {
    return {
      ...new Basket(),
      id: this.editForm.get(['id'])!.value,
      basketId: this.editForm.get(['basketId'])!.value,
      basketState: this.editForm.get(['basketState'])!.value,
      user: this.editForm.get(['user'])!.value,
      course: this.editForm.get(['course'])!.value,
      customer: this.editForm.get(['customer'])!.value,
    };
  }
}
