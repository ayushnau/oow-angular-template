import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Temporary basic template -->
    <div class="menu-popup">
      <!-- Add your menu popup content here -->
    </div>
  `
})
export class MenuPopupComponent {
  @Input() item: any;
  @Input() itemFavorite: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() setFavoriteItems = new EventEmitter<any>();
  @Output() onVariationSelect = new EventEmitter<any>();
} 