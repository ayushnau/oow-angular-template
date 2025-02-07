import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-food-info-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="food-info-popup" *ngIf="item">
      <!-- Add your food info popup content here -->
      <button (click)="closePopup()">Close</button>
    </div>
  `
})
export class FoodInfoPopupComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  
  nutrition: any = null;

  ngOnInit() {
    if (this.item?.nutrition) {
      try {
        this.nutrition = JSON.parse(this.item.nutrition);
      } catch (error) {
        console.error('Error parsing nutrition data:', error);
      }
    }
  }

  closePopup() {
    this.close.emit();
  }

  get nutritionKeys() {
    return this.nutrition ? Object.keys(this.nutrition) : [];
  }

  get totalCalories() {
    return this.nutrition?.calories?.amount || 0;
  }
} 