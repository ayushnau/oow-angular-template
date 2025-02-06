import { Routes } from '@angular/router';
import { RestaurantComponent } from './RestaurantPage/restaurant.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: RestaurantComponent },
  { path: 'checkout', component: CheckoutComponent },
];