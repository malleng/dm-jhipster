import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'restaurant',
        data: { pageTitle: 'coopcycleApp.restaurant.home.title' },
        loadChildren: () => import('./restaurant/restaurant.module').then(m => m.RestaurantModule),
      },
      {
        path: 'cooperative',
        data: { pageTitle: 'coopcycleApp.cooperative.home.title' },
        loadChildren: () => import('./cooperative/cooperative.module').then(m => m.CooperativeModule),
      },
      {
        path: 'basket',
        data: { pageTitle: 'coopcycleApp.basket.home.title' },
        loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'coopcycleApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'coopcycleApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'course',
        data: { pageTitle: 'coopcycleApp.course.home.title' },
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'coopcycleApp.order.home.title' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
