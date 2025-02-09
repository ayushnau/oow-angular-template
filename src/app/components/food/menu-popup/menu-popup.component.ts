import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodItem, Nutrition, Variation, AddonGroupItem, AddonDetail, VariationAddon } from '../../../interfaces/food.interface';
import { VariationSelectorComponent } from '../variation-selector/variation-selector.component';
import { VariationAddonSelectorComponent } from '../variation-addon-selector/variation-addon-selector.component';
import { AddonSelectorComponent } from '../addon-selector/addon-selector.component';

@Component({
  selector: 'app-menu-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, VariationSelectorComponent, VariationAddonSelectorComponent, AddonSelectorComponent],
  templateUrl: './menu-popup.component.html'
})
export class MenuPopupComponent implements OnInit {
  @Input() item!: FoodItem;
  @Input() itemFavorite: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<any>();
  @Output() setFavoriteItems = new EventEmitter<any>();

  itemType: 'basic' | 'variation' | 'addon' | 'variation-addon' = 'basic';
  selectedVariation: Variation | null = null;
  selectedAddons: { [key: string]: AddonGroupItem[] } = {};
  notes: string = '';
  quantity: number = 1;
  showTextarea: boolean = false;
  item_name: string = '';
  variation_name: string = '';
  description: string = '';
  nutrition: string | null = '';
  price: string = '';
  total_price: string = '';
  parsedNutrition: Nutrition | null = null;
  uniqueVariations: Variation[] = [];
  totalPrice: number = 0;

  ngOnInit() {
    this.determineItemType();
    if (this.item) {
      this.initializeItemDetails();
      this.initializeVariations();
      this.initializePrice();
    }
  }

  private determineItemType() {
    const hasVariation = this.item.variation?.length > 0;
    const hasVariationAddons = this.item.variationAddonDetails?.length > 0;
    const hasAddons = this.item.addon?.length > 0 && this.item.addonDetails?.length > 0;

    if (hasVariation && hasVariationAddons) {
      this.itemType = 'variation-addon';
    } else if (hasVariation) {
      this.itemType = 'variation';
    } else if (hasAddons) {
      this.itemType = 'addon';
    } else {
      this.itemType = 'basic';
    }
  }

  private initializeItemDetails() {
    this.item_name = this.item.item_name;
    this.description = this.item.item_description;
    this.price = this.item.price;
    this.total_price = this.price;
    
    if (typeof this.item.nutrition === 'string') {
      try {
        this.parsedNutrition = JSON.parse(this.item.nutrition);
        this.nutrition = `${this.parsedNutrition?.["calories"]?.amount} ${this.parsedNutrition?.["calories"]?.unit} - ${this.parsedNutrition?.["protien"]?.amount}${this.parsedNutrition?.["protien"]?.unit}`;
      } catch (e) {
        console.error('Error parsing nutrition:', e);
        this.nutrition = '';
      }
    } else if (this.item.nutrition) {
      this.parsedNutrition = this.item.nutrition;
      this.nutrition = `${this.parsedNutrition?.["calories"]?.amount} ${this.parsedNutrition?.["calories"]?.unit} - ${this.parsedNutrition?.["protien"]?.amount}${this.parsedNutrition?.["protien"]?.unit}`;
    }
  }

  private initializeVariations() {
    if (this.item?.variation) {
      // Get unique variations based on variationid
      this.uniqueVariations = Array.from(
        new Map(
          this.item.variation.map(item => [item.variationid, item])
        ).values()
      );

      // Auto-select the first variation
      if (this.uniqueVariations.length > 0) {
        this.onVariationSelect(this.uniqueVariations[0]);
      }
    }
  }

  private initializePrice() {
    this.totalPrice = parseFloat(this.item.price) || 0;
  }

  calculateTotalPrice(): number {
    let total = 0;
    
    if (this.itemType === 'basic') {
      total = parseFloat(this.item.price);
    } else if (this.selectedVariation) {
      total = parseFloat(this.selectedVariation.price);
    }

    // Add addon prices
    // this.selectedAddons.forEach(addon => {
    //   total += parseFloat(addon.addonitem_price);
    // });

    return total * this.quantity;
  }

  handleAddToCart(): void {
    const cartItem = {
      item: this.item,
      quantity: this.quantity,
      notes: this.notes,
      variation: this.selectedVariation,
      addons: this.selectedAddons,
      totalPrice: this.calculateTotalPrice()
    };

    this.addToCart.emit(cartItem);
    this.close.emit();
  }

  onVariationSelect(variation: Variation): void {
    this.selectedVariation = variation;
    this.variation_name = variation.name;
    this.price = variation.price;
    this.updateTotalPrice();
  }

  private updateTotalPrice() {
    if (this.selectedVariation) {
      this.totalPrice = parseFloat(this.selectedVariation.price) || 0;
    }
  }

  getAddonSelectionMin(addonGroupId: string): string {
    const addon = this.item?.addon?.find(a => a.addon_group_id === addonGroupId);
    return addon?.addon_item_selection_min || '0';
  }

  getVariationAddons(variation: Variation | null): AddonDetail[] {
    if (!variation || !this.item.variationAddonDetails) return [];
    return this.item.variationAddonDetails.filter(addondetail => 
      addondetail.variation_ids?.includes(variation.id)
    );
  }
  
  getRegularAddons(): AddonDetail[] {
    if (!this.item.addon || !this.item.addonDetails) return [];
    return this.item.addonDetails.filter(addon =>
      this.item.addon.some(a => a.addon_group_id === addon.addon_group_id)
    );
  }
  
  getSelectedCount(addonGroup: AddonDetail): number {
    // TODO: Implement actual count logic
    return 0;
  }

  getAddonMaxLimit(addonGroup: any, variation?: Variation | null): number {
    if (variation) {
      // For variation addons
      const addon = variation.addon;
      return addon?.addon_item_selection_max ? Number(addon.addon_item_selection_max) : 1;
    } else {
      // For regular addons
      const addon = this.item.addon?.find(a => a.addon_group_id === addonGroup.addon_group_id);
      return addon?.addon_item_selection_max ? Number(addon.addon_item_selection_max) : 1;
    }
  }

  getAddonMinLimit(addonGroup: any, variation?: Variation | null): number {
    if (variation) {
      // For variation addons
      const addon = variation.addon;
      return addon?.addon_item_selection_min ? Number(addon.addon_item_selection_min) : 0;
    } else {
      // For regular addons
      const addon = this.item.addon?.find(a => a.addon_group_id === addonGroup.addon_group_id);
      return addon?.addon_item_selection_min ? Number(addon.addon_item_selection_min) : 0;
    }
  }

  hasOnlyVariations(): boolean {
    return this.item?.variation?.length > 0 && 
           (!this.item?.variationAddonDetails || this.item.variationAddonDetails.length === 0);
  }

  hasVariationsWithAddons(): boolean {
    return this.item?.variation?.length > 0 && 
           this.item?.variationAddonDetails && 
           this.item.variationAddonDetails.length > 0;
  }

  hasOnlyAddons(): boolean {
    return (!this.item?.variation || this.item.variation.length === 0) && 
           this.item?.addon && 
           this.item.addon.length > 0;
  }


  private hasVariations(): boolean {
    return this.item.variation?.length > 0;
  }

  onTotalPriceChanged(newTotal: number) {
    this.totalPrice = newTotal;
  }

  onPriceUpdated(price: number) {
    this.totalPrice = price;
  }
} 