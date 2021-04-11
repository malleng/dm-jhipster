import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICooperative, Cooperative } from '../cooperative.model';
import { CooperativeService } from '../service/cooperative.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

@Component({
  selector: 'jhi-cooperative-update',
  templateUrl: './cooperative-update.component.html',
})
export class CooperativeUpdateComponent implements OnInit {
  isSaving = false;

  restaurantsSharedCollection: IRestaurant[] = [];

  editForm = this.fb.group({
    id: [],
    cooperativeId: [null, [Validators.required]],
    name: [],
    area: [],
    restaurants: [],
  });

  constructor(
    protected cooperativeService: CooperativeService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cooperative }) => {
      this.updateForm(cooperative);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cooperative = this.createFromForm();
    if (cooperative.id !== undefined) {
      this.subscribeToSaveResponse(this.cooperativeService.update(cooperative));
    } else {
      this.subscribeToSaveResponse(this.cooperativeService.create(cooperative));
    }
  }

  trackRestaurantById(index: number, item: IRestaurant): number {
    return item.id!;
  }

  getSelectedRestaurant(option: IRestaurant, selectedVals?: IRestaurant[]): IRestaurant {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICooperative>>): void {
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

  protected updateForm(cooperative: ICooperative): void {
    this.editForm.patchValue({
      id: cooperative.id,
      cooperativeId: cooperative.cooperativeId,
      name: cooperative.name,
      area: cooperative.area,
      restaurants: cooperative.restaurants,
    });

    this.restaurantsSharedCollection = this.restaurantService.addRestaurantToCollectionIfMissing(
      this.restaurantsSharedCollection,
      ...(cooperative.restaurants ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.restaurantService
      .query()
      .pipe(map((res: HttpResponse<IRestaurant[]>) => res.body ?? []))
      .pipe(
        map((restaurants: IRestaurant[]) =>
          this.restaurantService.addRestaurantToCollectionIfMissing(restaurants, ...(this.editForm.get('restaurants')!.value ?? []))
        )
      )
      .subscribe((restaurants: IRestaurant[]) => (this.restaurantsSharedCollection = restaurants));
  }

  protected createFromForm(): ICooperative {
    return {
      ...new Cooperative(),
      id: this.editForm.get(['id'])!.value,
      cooperativeId: this.editForm.get(['cooperativeId'])!.value,
      name: this.editForm.get(['name'])!.value,
      area: this.editForm.get(['area'])!.value,
      restaurants: this.editForm.get(['restaurants'])!.value,
    };
  }
}
