import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BasketComponent } from '../list/basket.component';
import { BasketDetailComponent } from '../detail/basket-detail.component';
import { BasketUpdateComponent } from '../update/basket-update.component';
import { BasketRoutingResolveService } from './basket-routing-resolve.service';

const basketRoute: Routes = [
  {
    path: '',
    component: BasketComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BasketDetailComponent,
    resolve: {
      basket: BasketRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BasketUpdateComponent,
    resolve: {
      basket: BasketRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BasketUpdateComponent,
    resolve: {
      basket: BasketRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(basketRoute)],
  exports: [RouterModule],
})
export class BasketRoutingModule {}
