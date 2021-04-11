import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { IBasket } from 'app/entities/basket/basket.model';
import { BasketService } from 'app/entities/basket/service/basket.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;

  basketsSharedCollection: IBasket[] = [];
  restaurantsSharedCollection: IRestaurant[] = [];

  editForm = this.fb.group({
    id: [],
    price: [null, [Validators.required, Validators.min(0)]],
    disponibility: [],
    description: [],
    basket: [],
    restaurant: [],
  });

  constructor(
    protected productService: ProductService,
    protected basketService: BasketService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackBasketById(index: number, item: IBasket): number {
    return item.id!;
  }

  trackRestaurantById(index: number, item: IRestaurant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      price: product.price,
      disponibility: product.disponibility,
      description: product.description,
      basket: product.basket,
      restaurant: product.restaurant,
    });

    this.basketsSharedCollection = this.basketService.addBasketToCollectionIfMissing(this.basketsSharedCollection, product.basket);
    this.restaurantsSharedCollection = this.restaurantService.addRestaurantToCollectionIfMissing(
      this.restaurantsSharedCollection,
      product.restaurant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.basketService
      .query()
      .pipe(map((res: HttpResponse<IBasket[]>) => res.body ?? []))
      .pipe(map((baskets: IBasket[]) => this.basketService.addBasketToCollectionIfMissing(baskets, this.editForm.get('basket')!.value)))
      .subscribe((baskets: IBasket[]) => (this.basketsSharedCollection = baskets));

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

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      price: this.editForm.get(['price'])!.value,
      disponibility: this.editForm.get(['disponibility'])!.value,
      description: this.editForm.get(['description'])!.value,
      basket: this.editForm.get(['basket'])!.value,
      restaurant: this.editForm.get(['restaurant'])!.value,
    };
  }
}
