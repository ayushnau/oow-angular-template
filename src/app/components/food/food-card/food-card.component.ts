import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem, Nutrition } from '../../../interfaces/food.interface';
import { HeartIconComponent, VegIconComponent, InfoArrowIconComponent, MinusIconComponent, PlusIconComponent } from '../../../icons/foodcard-icons.component';
import { MenuPopupComponent } from '../menu-popup/menu-popup.component';
import { FoodInfoPopupComponent } from '../food-info-popup/food-info-popup.component';
import { VariationAddonSelectorComponent } from '../variation-addon-selector/variation-addon-selector.component';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';
@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [
    CommonModule,
    HeartIconComponent,
    VegIconComponent,
    InfoArrowIconComponent,
    MinusIconComponent,
    PlusIconComponent,
    MenuPopupComponent,
    FoodInfoPopupComponent,
    VariationAddonSelectorComponent
  ],
  templateUrl: './food-card.component.html'
})
export class FoodCardComponent implements OnInit {
  @Input() item!: FoodItem;
  @Input() isItemInCart: boolean = false;
  @Input() itemFavorite: boolean = false;
  @Input() variation: boolean = false;

  isShowFoodPopUp: string | null = null;
  isShowMenuPopUp: string | null = null;
  isShowPreviousPopUp: string | null = null;

  itemType: 'variation' | 'variationSelector' | 'addonSelector' = 'variation';
  parsedNutrition: Nutrition | null = null;
  displayPrice: string = '0';
  hasVariations: boolean = false;
  hasAddons: boolean = false;
  basePrice: string = '0';
  nutrition: any;
  quantity: number = 0;

  constructor(private cartService: CartService, private toast: ToastService) {}

  ngOnInit() {
    this.initializeComponent();
    this.updateQuantity();
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(() => {
      this.updateQuantity();
    });
  }

  private initializeComponent() {
    this.determineItemType();
    this.setDisplayPrice();
    this.hasVariations = this.item.item_allow_variation === '1' && this.item.variation?.length > 0;
    this.hasAddons = this.item.addon?.length > 0 && this.item.addonDetails?.length > 0;
    
    // Set base price based on variations
    if (this.hasVariations) {
      const lowestPriceVariation = this.item.variation
        .filter(v => v.active === '1')
        .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[0];
      this.basePrice = lowestPriceVariation?.price || '0';
    } else {
      this.basePrice = this.item.price;
    }

    // Parse nutrition
    if (typeof this.item.nutrition === 'string') {
      try {
        this.parsedNutrition = JSON.parse(this.item.nutrition);
      } catch (e) {
        this.parsedNutrition = null;
      }
    } else {
      this.parsedNutrition = this.item.nutrition;
    }
  }

  private determineItemType() {
    if (this.item.item_allow_variation === '1' && this.item.variation.length > 0) {
      // Check if variations have addons
      const hasVariationAddons = this.item.variation.some(v => v.variationallowaddon === 1);
      this.itemType = hasVariationAddons ? 'variationSelector' : 'variation';
    } else if (this.item.addon.length > 0) {
      this.itemType = 'addonSelector';
    }
  }

  private setDisplayPrice() {
    if (this.itemType === 'addonSelector') {
      this.displayPrice = this.item.price;
    } else if (this.item.variation.length > 0) {
      // Get the minimum price from variations
      const prices = this.item.variation
        .map(v => parseFloat(v.price))
        .filter(p => !isNaN(p));

      this.displayPrice = prices.length > 0 ? Math.min(...prices).toString() : '0';
    }
  }

  hasCustomization(): boolean {
    return this.itemType === 'variationSelector' || 
           this.itemType === 'addonSelector' || 
           (this.itemType === 'variation' && this.item.variation.length > 0);
  }

  closePopup() {
    this.isShowFoodPopUp = null;
    this.isShowMenuPopUp = null;
    this.isShowPreviousPopUp = null;
  }

  handleVariationSelect(variation: any) {
    console.log('Selected variation:', variation);
  }

  showFoodPopUp() {
    this.isShowFoodPopUp = this.item._id;
  }

  showMenuPopUp() {
    console.log('Opening menu popup for item:', this.item._id);
    this.isShowMenuPopUp = this.item._id;
  }

  setFavoriteItems(event: any) {
    console.log('Favorite items:', event);
  }

  updateQuantity() {
    this.cartService.cartItems$.subscribe(cartItems => {
      const cartItem = cartItems.find(cartItem => 
        cartItem.item_id === this.item.item_id
      );
      this.quantity = cartItem ? cartItem.quantity : 0;
    });
  }

  incrementQuantity(event: Event) {
    event.stopPropagation();   

    this.cartService.getCartItems().subscribe(cartItemsincrementQuantity => {
      const cartItem = cartItemsincrementQuantity.results.find((cartItemincrementQuantity: any) => 
         cartItemincrementQuantity.items_details._id === this.item._id
      );
      if(!cartItem){
        this.toast.error('item not found in cart')
      }
      this.cartService.updateQuantity(cartItem?._id, this.quantity + 1).subscribe();
    });
  }

  decrementQuantity(event: Event) {
    event.stopPropagation();
    if (this.quantity > 0) {
      this.cartService.getCartItems().subscribe(cartItemsdecrementQuantity => {
        const cartItem = cartItemsdecrementQuantity.results.find((cartItemsdecrementQuantity: any) => 
           cartItemsdecrementQuantity.items_details._id === this.item._id
        );
        if(!cartItem){
          this.toast.error('item not found in cart')
        }
        this.cartService.updateQuantity(cartItem?._id, this.quantity - 1).subscribe();
      });
    }
  }
} 


// fix the logic for the quantity control 
// show the basic checkout page. 