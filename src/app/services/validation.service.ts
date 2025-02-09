import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AddonGroup, Variation } from '../interfaces/food.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private validationMessageSource = new BehaviorSubject<string>('');
  currentMessage = this.validationMessageSource.asObservable();

  constructor() { }

  updateMessage(message: string) {
    this.validationMessageSource.next(message);
  }

  clearMessage() {
    this.validationMessageSource.next('');
  }

  validateVariationSelection(selectedVariation: Variation | null): boolean {
    if (!selectedVariation) {
      this.updateMessage('Please select a variation');
      return false;
    }
    return true;
  }

  validateAddonSelections(
    addonGroups: AddonGroup[],
    selectedAddons: { [key: string]: any[] },
    variation?: Variation
  ): boolean {
    if (!addonGroups?.length) return true;

    for (const group of addonGroups) {
      const selectedCount = selectedAddons[group.addon_group_id]?.length || 0;
      let minLimit = 0;
      let maxLimit = 0;

      if (variation) {
        // Get limits from variation addon config
        const addonConfig = variation.addon;
        if (addonConfig) {
          minLimit = parseInt(addonConfig.addon_item_selection_min, 10);
          maxLimit = parseInt(addonConfig.addon_item_selection_max, 10);
        }
      }

      if (selectedCount < minLimit) {
        this.updateMessage(`Please select at least ${minLimit} option(s) from ${group.addon_group_name}`);
        return false;
      }

      if (maxLimit > 0 && selectedCount > maxLimit) {
        this.updateMessage(`You can select maximum ${maxLimit} option(s) from ${group.addon_group_name}`);
        return false;
      }
    }

    this.clearMessage();
    return true;
  }
} 