import { Component, inject, effect, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../services/cart.serivce';


import { ToastService } from '../services/toast.service';
import { Store } from '@ngrx/store';
export interface MenuItem {
  _id: string;
  item_name: string;
  item_description: string;
  price: string;
  item_image_url: string;
  nutrition: string;
  variation: Array<{
    variation_id: string;
    name: string;
    price: string;
  }>;
  in_stock: string;
  cuisine: string[];
}

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "../RestaurantPage/restaurant.component.html",
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RestaurantComponent {
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private store = inject(Store);


  menuItems = toSignal(
    this.http.get<{results: MenuItem[]}>(
      'https://themeonestaging.petpooja.com/api/menu/best_products/3zrbef51'
    ),
    { initialValue: {results: []} as {results: MenuItem[]} }
  );

  getNutrition(nutritionString: string) {
    try {
      return JSON.parse(nutritionString);
    } catch {
      throw new Error('Invalid nutrition data');
    }
  }

  constructor() {
    effect(() => {
      console.log('menuItems changed:', this.menuItems().results);
    });
  }


  addToCart(item: MenuItem) {
    alert('item is added to the cart.')
    this.cartService.addToCart(item);
    this.toastService.success('Item added to cart', 'Go to Checkout', 3000);
  }
}