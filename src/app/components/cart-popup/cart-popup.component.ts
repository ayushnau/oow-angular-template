import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div class="absolute right-0 top-0 h-full w-96 bg-white shadow-lg">
        <div class="p-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Your Cart</h2>
            <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <!-- Add cart items here -->
        </div>
      </div>
    </div>
  `
})
export class CartPopupComponent {
  @Output() close = new EventEmitter<void>();
} 