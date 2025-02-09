import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem, AddonDetail } from '../../../interfaces/food.interface';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-addon-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addon-selector.component.html'
})
export class AddonSelectorComponent {
  @Input() item!: FoodItem;
  @Output() priceUpdated = new EventEmitter<void>();
  @Output() addonSelected = new EventEmitter<{groupId: string, itemId: string}>();
  
  selectedAddons: { [key: string]: string[] } = {};

  constructor(private validationService: ValidationService) {}

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
    const groupId = addonGroup.addon_group_id;
    if (!this.selectedAddons[groupId]) {
      this.selectedAddons[groupId] = [];
    }

    const index = this.selectedAddons[groupId].indexOf(addonItemId);
    if (index === -1) {
      if (this.selectedAddons[groupId].length < this.getAddonMaxLimit(addonGroup)) {
        this.selectedAddons[groupId].push(addonItemId);
      } else {
        this.validationService.updateMessage(`You can select maximum ${this.getAddonMaxLimit(addonGroup)} option(s) from ${addonGroup.addon_group_name}`);
        return;
      }
    } else {
      this.selectedAddons[groupId].splice(index, 1);
    }

    this.validationService.clearMessage();
    this.addonSelected.emit({groupId, itemId: addonItemId});
    this.priceUpdated.emit();
  }

  isAddonSelected(addonGroup: AddonDetail, addonItemId: string): boolean {
    return this.selectedAddons[addonGroup.addon_group_id]?.includes(addonItemId) || false;
  }

  validateSelections(): boolean {
    return this.validationService.validateAddonSelections(this.getAddonGroups(), this.selectedAddons);
  }
} 