import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BasketComponent } from './list/basket.component';
import { BasketDetailComponent } from './detail/basket-detail.component';
import { BasketUpdateComponent } from './update/basket-update.component';
import { BasketDeleteDialogComponent } from './delete/basket-delete-dialog.component';
import { BasketRoutingModule } from './route/basket-routing.module';

@NgModule({
  imports: [SharedModule, BasketRoutingModule],
  declarations: [BasketComponent, BasketDetailComponent, BasketUpdateComponent, BasketDeleteDialogComponent],
  entryComponents: [BasketDeleteDialogComponent],
})
export class BasketModule {}
