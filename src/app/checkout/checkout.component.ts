import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.serivce';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Checkout</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <div *ngIf="cartService.getCartCount().length === 0" class="text-center py-8">
          <p class="text-gray-600">Your cart is empty</p>
        </div>
        
        <div *ngFor="let item of cartService.getCartCount()" class="flex justify-between items-center py-4 border-b">
          <div>
            <h3 class="font-semibold">{{item.item_name}}</h3>
            <p class="text-gray-600">₹{{item.price}}</p>
          </div>
        </div>

        <div *ngIf="cartService.getCartCount().length > 0" class="mt-6">
          <button class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  cartService = inject(CartService);
} 