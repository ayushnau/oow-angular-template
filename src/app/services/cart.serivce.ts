import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../RestaurantPage/restaurant.component';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<MenuItem[]>([]);

  addToCart(item: MenuItem) {
    this.cartItems.update(items => [...items, item]);
  }

  getCartCount() {
    console.log(this.cartItems(), ">>>>>>this.cartItems()")
    return this.cartItems();
  }
}
