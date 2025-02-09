import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem, AddonDetail } from '../../../interfaces/food.interface';

@Component({
  selector: 'app-addon-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addon-selector.component.html'
})
export class AddonSelectorComponent {
  @Input() item!: FoodItem;
  @Output() priceUpdated = new EventEmitter<void>();
  
  selectedAddons: { [key: string]: string[] } = {};

  getAddonGroups(): AddonDetail[] {
    if (!this.item.addon || !this.item.addonDetails) return [];
    return this.item.addonDetails.filter(addon =>
      this.item.addon.some(a => a.addon_group_id === addon.addon_group_id)
    );
  }

  getAddonMaxLimit(addonGroup: AddonDetail): number {
    const addon = this.item.addon?.find(a => a.addon_group_id === addonGroup.addon_group_id);
    return addon?.addon_item_selection_max ? Number(addon.addon_item_selection_max) : 1;
  }

  getAddonMinLimit(addonGroup: AddonDetail): number {
    const addon = this.item.addon?.find(a => a.addon_group_id === addonGroup.addon_group_id);
    return addon?.addon_item_selection_min ? Number(addon.addon_item_selection_min) : 0;
  }

  onAddonSelect(addonGroup: AddonDetail, addonItemId: string) {
    if (!this.selectedAddons[addonGroup.addon_group_id]) {
      this.selectedAddons[addonGroup.addon_group_id] = [];
    }

    const currentSelections = this.selectedAddons[addonGroup.addon_group_id];
    const maxLimit = this.getAddonMaxLimit(addonGroup);

    if (currentSelections.includes(addonItemId)) {
      this.selectedAddons[addonGroup.addon_group_id] = currentSelections.filter(id => id !== addonItemId);
    } else if (currentSelections.length < maxLimit) {
      this.selectedAddons[addonGroup.addon_group_id].push(addonItemId);
    }

    this.priceUpdated.emit();
  }

  isAddonSelected(addonGroup: AddonDetail, addonItemId: string): boolean {
    return this.selectedAddons[addonGroup.addon_group_id]?.includes(addonItemId) || false;
  }
} 