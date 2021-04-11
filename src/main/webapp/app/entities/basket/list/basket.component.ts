import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBasket } from '../basket.model';
import { BasketService } from '../service/basket.service';
import { BasketDeleteDialogComponent } from '../delete/basket-delete-dialog.component';

@Component({
  selector: 'jhi-basket',
  templateUrl: './basket.component.html',
})
export class BasketComponent implements OnInit {
  baskets?: IBasket[];
  isLoading = false;

  constructor(protected basketService: BasketService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.basketService.query().subscribe(
      (res: HttpResponse<IBasket[]>) => {
        this.isLoading = false;
        this.baskets = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBasket): number {
    return item.id!;
  }

  delete(basket: IBasket): void {
    const modalRef = this.modalService.open(BasketDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.basket = basket;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
