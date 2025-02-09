import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem, Variation, VariationAddon, AddonDetail, AddonGroupItem, AddonGroup } from '../../../interfaces/food.interface';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-variation-addon-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variation-addon-selector.component.html'
})
export class VariationAddonSelectorComponent implements OnInit, OnChanges {
  @Input() item!: FoodItem;
  @Input() selectedVariation: Variation | null = null;
  @Input() variationAddonDetails: AddonGroup[] = [];
  @Output() variationSelected = new EventEmitter<Variation>();
  @Output() addonSelected = new EventEmitter<{groupId: string, itemId: string}>();
  @Output() validationChanged = new EventEmitter<boolean>();
  @Output() priceUpdated = new EventEmitter<number>();
  
  uniqueVariations: Variation[] = [];
  public selectedAddons: { [key: string]: string[] } = {};
  disabledDetails: { [key: string]: { currentSelectedCount: number, disabled: boolean } } = {};
  totalPrice: number = 0;

  constructor(public validationService: ValidationService) {}

  ngOnInit() {
    this.initializeVariations();
    this.validateSelections();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes detected:', changes);
    
    // Check if relevant inputs have changed
    if (changes['selectedVariation'] || changes['variationAddonDetails'] || changes['item']) {
      console.log('Relevant changes detected, validating...');
      this.validateSelections();
    }
  }

  private initializeVariations() {
    if (this.item?.variation) {
      // Group variations by variationid to get unique variations
      const variationMap = new Map();
      this.item.variation.forEach(variation => {
        if (!variationMap.has(variation.variationid)) {
          variationMap.set(variation.variationid, variation);
        }
      });
      this.uniqueVariations = Array.from(variationMap.values());

      // Select first variation by default if there's only one
      // if (this.uniqueVariations.length === 1) {
        this.onSelect(this.uniqueVariations[0]);
      // }
    }
  }

  onSelect(variation: Variation) {
    this.selectedVariation = variation;
    this.variationSelected.emit(variation);
    this.selectedAddons = {}; // Reset addons when variation changes
    this.calculateTotalPrice();
    this.validateSelections();
  }

  getVariationAddons(variation: Variation | null): AddonDetail[] {
    if (!variation || !this.item.variationAddonDetails) return [];
    return this.item.variationAddonDetails.filter(addonDetail => 
      addonDetail.variation_ids?.includes(variation.id)
    );
  }

  getAddonMaxLimit(addonGroup: AddonDetail): number {
    if (!this.selectedVariation) return 0;
    const addonConfig = this.findAddonConfig(addonGroup.addon_group_id);
    return addonConfig ? Number(addonConfig.addon_item_selection_max) : 1;
  }

  getAddonMinLimit(addonGroup: AddonDetail): number {
    if (!this.selectedVariation) return 0;
    const addonConfig = this.findAddonConfig(addonGroup.addon_group_id);
    return addonConfig ? Number(addonConfig.addon_item_selection_min) : 0;
  }

  private findAddonConfig(groupId: string) {
    if (!this.selectedVariation?.addon) return null;
    return Array.isArray(this.selectedVariation.addon) 
      ? this.selectedVariation.addon.find(a => a.addon_group_id === groupId)
      : this.selectedVariation.addon;
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

    this.calculateTotalPrice();
    this.validateSelections();
  }

  isAddonSelected(addonGroup: AddonDetail, addonItemId: string): boolean {
    return this.selectedAddons[addonGroup.addon_group_id]?.includes(addonItemId) || false;
  }

  private validateSelections() {
    if (!this.selectedVariation || !this.selectedVariation.addon) {
      this.validationService.updateMessage('');
      return;
    }

    const addons = Array.isArray(this.selectedVariation.addon) 
      ? this.selectedVariation.addon 
      : [this.selectedVariation.addon];

    for (const addonConfig of addons) {
      const currentCount = this.selectedAddons[addonConfig.addon_group_id]?.length || 0;
      const min = Number(addonConfig.addon_item_selection_min);
      const max = Number(addonConfig.addon_item_selection_max);

      if (currentCount < min) {
        const group = this.item.variationAddonDetails.find(
          g => g.addon_group_id === addonConfig.addon_group_id
        );
        if (group) {
          this.validationService.updateMessage(
            `Please select at least ${min} items from ${group.addon_group_name}`
          );
          return;
        }
      }
    }

    this.validationService.updateMessage('');
  }

  get hasVariations(): boolean {
    return this.item?.variation?.length > 0;
  }

  get hasVariationAddons(): boolean {
    return this.item?.variationAddonDetails?.length > 0;
  }

  getUniqueVariations() {
    if (!this.item?.variation) return [];
    return Array.from(
      new Map(this.item.variation.map(item => [item.variationid, item])).values()
    );
  }

  onVariationSelect(variation: any) {
    this.selectedVariation = variation;
    this.selectedAddons = {}; // Reset addons when variation changes
    this.validateSelections();
  }

  isAddonGroupValidForVariation(addonGroup: any, variation: any): boolean {
    return addonGroup.variation_ids?.includes(variation.id);
  }

  getMinMaxText(variation: any, groupId: string): string {
    const addon = variation.addon;
    if (!addon) return '';
    const addonConfig = addon.find((a: any) => a.addon_group_id === groupId);
    if (!addonConfig) return '';
    return `${addonConfig.addon_item_selection_min} - ${addonConfig.addon_item_selection_max} items`;
  }

  isAddonDisabled(groupId: string): boolean {
    if (!this.selectedVariation) return true;
    const addon = this.selectedVariation.addon;
    if (!addon) return true;
    return true;
    // const addonConfig = addon.find((a: any) => a.addon_group_id === groupId);
    // if (!addonConfig) return true;
    
    // const currentCount = this.selectedAddons[groupId]?.length || 0;
    // return currentCount >= parseInt(addonConfig.addon_item_selection_max);
  }

  private calculateTotalPrice() {
    let total = 0;

    // Add variation price
    if (this.selectedVariation) {
      total += parseFloat(this.selectedVariation.price);
    }

    // Add addon prices
    Object.entries(this.selectedAddons).forEach(([groupId, selectedIds]) => {
      const addonGroup = this.item.variationAddonDetails?.find(
        group => group.addon_group_id === groupId
      );

      if (addonGroup) {
        selectedIds.forEach(addonId => {
          const addonItem = addonGroup.addon_group_items.find(
            item => item.addonitemid === addonId
          );
          if (addonItem) {
            total += parseFloat(addonItem.addonitem_price);
          }
        });
      }
    });

    this.priceUpdated.emit(total);
  }
} 