import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBasket } from '../basket.model';
import { BasketService } from '../service/basket.service';

@Component({
  templateUrl: './basket-delete-dialog.component.html',
})
export class BasketDeleteDialogComponent {
  basket?: IBasket;

  constructor(protected basketService: BasketService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.basketService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
