import { Routes } from '@angular/router';
import { BestsellerComponent } from './pages/bestseller/bestseller.component';
import { CartSummaryComponent } from './pages/checkout/checkout.component';
export const routes: Routes = [
  { path: '', component: BestsellerComponent },
  { path: 'checkout', component: CartSummaryComponent },
];