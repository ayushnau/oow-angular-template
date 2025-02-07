import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodInfoPopupComponent } from '../food-info-popup/food-info-popup.component';
import { MenuPopupComponent } from '../menu-popup/menu-popup.component';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [
    CommonModule,
    FoodInfoPopupComponent,
    MenuPopupComponent
  ],
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss']
})
export class FoodCardComponent {
  @Input() item: any;
  @Input() isItemInCart: boolean = false;
  @Input() itemFavorite: boolean = false;
  @Input() variation: boolean = false;

  isShowFoodPopUp: string | null = null;
  isShowMenuPopUp: string | null = null;
  isShowPreviousPopUp: string | null = null;

  closePopup() {
    this.isShowFoodPopUp = null;
    this.isShowMenuPopUp = null;
    this.isShowPreviousPopUp = null;
  }

  handleVariationSelect(variation: any) {
    // Handle variation selection
    console.log('Selected variation:', variation);
  }

  showFoodInfo(itemId: string) {
    this.isShowFoodPopUp = itemId;
  }

  showMenuPopup(itemId: string) {
    this.isShowMenuPopUp = itemId;
  }

  setFavoriteItems(items: any) {
    // Handle favorite items update
    console.log('Updated favorite items:', items);
  }
} 