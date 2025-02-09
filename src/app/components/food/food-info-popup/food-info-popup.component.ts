import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem } from '../../../interfaces/food.interface';

@Component({
  selector: 'app-food-info-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black opacity-50" (click)="close.emit()"></div>
      
      <div class="relative bg-white w-full max-w-md rounded-lg shadow-lg p-4">
        <button (click)="close.emit()" class="absolute top-2 right-2">
          <span class="sr-only">Close</span>
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-xl font-semibold mb-4">{{item.item_name}}</h2>
        
        @if (item.nutrition) {
          <div class="space-y-2">
            <h3 class="font-medium">Nutrition Information</h3>
            <div class="grid grid-cols-2 gap-4">
              @if (nutrition.calories) {
                <div>
                  <p class="text-sm text-gray-600">Calories</p>
                  <p>{{nutrition.calories.amount}} {{nutrition.calories.unit}}</p>
                </div>
              }
              @if (nutrition.protien) {
                <div>
                  <p class="text-sm text-gray-600">Protein</p>
                  <p>{{nutrition.protien.amount}} {{nutrition.protien.unit}}</p>
                </div>
              }
              @if (nutrition.carbohydrate) {
                <div>
                  <p class="text-sm text-gray-600">Carbohydrates</p>
                  <p>{{nutrition.carbohydrate.amount}} {{nutrition.carbohydrate.unit}}</p>
                </div>
              }
              @if (nutrition.totalFat) {
                <div>
                  <p class="text-sm text-gray-600">Total Fat</p>
                  <p>{{nutrition.totalFat.amount}} {{nutrition.totalFat.unit}}</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class FoodInfoPopupComponent {
  @Input() item!: FoodItem;
  @Output() close = new EventEmitter<void>();

  get nutrition() {
    if (typeof this.item.nutrition === 'string') {
      try {
        return JSON.parse(this.item.nutrition);
      } catch {
        return {};
      }
    }
    return this.item.nutrition || {};
  }
} 