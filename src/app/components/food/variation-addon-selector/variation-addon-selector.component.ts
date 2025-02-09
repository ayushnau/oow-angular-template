import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem, Variation, VariationAddon, AddonDetail } from '../../../interfaces/food.interface';

@Component({
  selector: 'app-variation-addon-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variation-addon-selector.component.html'
})
export class VariationAddonSelectorComponent implements OnInit {
  @Input() item!: FoodItem;
  @Input() selectedVariation: Variation | null = null;
  @Output() variationSelected = new EventEmitter<Variation>();
  
  uniqueVariations: Variation[] = [];
  selectedAddons: { [key: string]: string[] } = {};

  ngOnInit() {
    this.initializeVariations();
  }

  private initializeVariations() {
    if (this.item?.variation) {
      this.uniqueVariations = Array.from(
        new Map(this.item.variation.map(item => [item.variationid, item])).values()
      );
      
      if (this.uniqueVariations.length > 0 && !this.selectedVariation) {
        this.onSelect(this.uniqueVariations[0]);
      }
    }
  }

  onSelect(variation: Variation) {
    this.selectedVariation = variation;
    this.variationSelected.emit(variation);
  }

  getVariationAddons(variation: Variation | null): AddonDetail[] {
    if (!variation || !this.item.variationAddonDetails) return [];
    return this.item.variationAddonDetails.filter(addonDetail => 
      addonDetail.variation_ids?.includes(variation.id)
    );
  }

  getAddonMaxLimit(addonGroup: AddonDetail): number {
    if (!this.selectedVariation) return 0;
    const addon = this.selectedVariation.addon;
    return addon?.addon_item_selection_max ? Number(addon.addon_item_selection_max) : 1;
  }

  getAddonMinLimit(addonGroup: AddonDetail): number {
    if (!this.selectedVariation) return 0;
    const addon = this.selectedVariation.addon;
    return addon?.addon_item_selection_min ? Number(addon.addon_item_selection_min) : 0;
  }

  onAddonSelect(addonGroup: AddonDetail, addonItemId: string) {
    if (!this.selectedAddons[addonGroup.addon_group_id]) {
      this.selectedAddons[addonGroup.addon_group_id] = [];
    }

    const currentSelections = this.selectedAddons[addonGroup.addon_group_id];
    const maxLimit = this.getAddonMaxLimit(addonGroup);

    if (currentSelections.includes(addonItemId)) {
      // Remove if already selected
      this.selectedAddons[addonGroup.addon_group_id] = currentSelections.filter(id => id !== addonItemId);
    } else if (currentSelections.length < maxLimit) {
      // Add if under limit
      this.selectedAddons[addonGroup.addon_group_id].push(addonItemId);
    }
  }

  isAddonSelected(addonGroup: AddonDetail, addonItemId: string): boolean {
    return this.selectedAddons[addonGroup.addon_group_id]?.includes(addonItemId) || false;
  }
} 