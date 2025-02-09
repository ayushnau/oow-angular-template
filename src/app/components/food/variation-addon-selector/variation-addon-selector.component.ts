import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem, Variation, Addon, AddonGroupItem, AddonDetail } from '../../../interfaces/food.interface';

@Component({
  selector: 'app-variation-addon-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mx-[3.8%] mb-2">
      @for (group of filteredAddonGroups; track group.addon_group_id) {
        <div class="rounded-[10px] border-2 mb-4">
          <div class="flex item-center flex-col border-b-2 py-[1%] px-4">
            <div class="flex justify-between items-center cursor-pointer">
              <p>{{group.addon_group_name}}</p>
              <div class="flex items-center gap-4">
                <p class="text-gray-500 text-sm">({{getSelectedCount(group)}}/{{getMaxSelection(group)}})</p>
                <p>
                  <svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.599927 6.99625C0.866626 7.26791 1.29903 7.26791 1.56573 6.99625L5.9999 2.47945L10.4341 6.99625C10.7008 7.26791 11.1332 7.26791 11.3999 6.99625C11.6666 6.72458 11.6666 6.28411 11.3999 6.01244L6.4828 1.00375C6.21611 0.732079 5.7837 0.732079 5.517 1.00375L0.599927 6.01244C0.333227 6.28411 0.333227 6.72458 0.599927 6.99625Z" fill="#0C1D2E"/>
                  </svg>
                </p>
              </div>
            </div>
            <div class="text-xs text-gray-500 flex items-end justify-end">
              Select at least {{getMinSelection(group)}} option
            </div>
          </div>
          <div class="px-[16px] py-[1px] max-h-[20vh] custom-scrollbar overflow-y-auto">
            @for (addon of group.addon_group_items; track addon.addonitemid) {
              <div class="flex justify-between relative items-center mb-1">
                <div class="flex items-center">
                  <input type="checkbox" 
                         [id]="'addon-' + group._id + '-' + addon.addonitemid"
                         class="mr-2"
                         [checked]="isSelected(addon, group)"
                         [disabled]="!canSelect(addon, group)"
                         (change)="onAddonSelect(addon, group)">
                  <label [for]="'addon-' + group._id + '-' + addon.addonitemid" 
                         class="cursor-pointer"
                         [class.line-through]="!canSelect(addon, group)"
                         [class.text-gray-300]="!canSelect(addon, group)">
                    {{addon.addonitem_name}}
                  </label>
                </div>
                @if (!canSelect(addon, group)) {
                  <div class="absolute w-full h-[1px] bg-gray-300"></div>
                }
                <div [class.text-gray-300]="!canSelect(addon, group)"
                   [class.text-gray-500]="canSelect(addon, group)"
                   class="flex items-center">
                  <div class="font-[550] pr-[2px]">INR</div>{{addon.addonitem_price}}.00
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class VariationAddonSelectorComponent {
  @Input() item!: FoodItem;
  @Input() selectedVariation!: Variation;
  @Input() selectedAddons: AddonGroupItem[] = [];
  @Output() selectedAddonsChange = new EventEmitter<AddonGroupItem[]>();

  get filteredAddonGroups(): AddonDetail[] {
    if (!this.selectedVariation?.addon) return [];
    return this.item.variationAddonDetails.filter(group => 
      this.selectedVariation?.addon?.addon_group_id === group.addon_group_id
    );
  }

  getSelectionRange(): string {
    if (!this.selectedVariation?.addon) return '0-0';
    const min = this.selectedVariation.addon.addon_item_selection_min;
    const max = this.selectedVariation.addon.addon_item_selection_max;
    return min === max ? min : `${min}-${max}`;
  }

  isAddonSelected(addon: AddonGroupItem, group: AddonDetail): boolean {
    return this.selectedAddons.some(selected => 
      selected.addonitemid === addon.addonitemid && 
      selected._id === group._id
    );
  }

  isAddonDisabled(addon: AddonGroupItem, group: AddonDetail): boolean {
    if (!this.selectedVariation?.addon) return true;
    
    const selectedCount = this.selectedAddons.filter(
      selected => selected._id === group._id
    ).length;
    
    const max = parseInt(this.selectedVariation.addon.addon_item_selection_max);
    return selectedCount >= max && !this.isAddonSelected(addon, group);
  }

  onAddonSelect(addon: AddonGroupItem, group: AddonDetail): void {
    if (this.isAddonDisabled(addon, group)) return;

    const isSelected = this.isAddonSelected(addon, group);
    let updatedAddons: AddonGroupItem[];

    if (isSelected) {
      updatedAddons = this.selectedAddons.filter(
        selected => !(selected.addonitemid === addon.addonitemid && selected._id === group._id)
      );
    } else {
      updatedAddons = [...this.selectedAddons, { ...addon, _id: group._id }];
    }

    this.selectedAddonsChange.emit(updatedAddons);
  }

  getSelectedCount(group: AddonDetail): number {
    return this.selectedAddons.filter(selected => selected._id === group._id).length;
  }

  getMaxSelection(group: AddonDetail): number {
    if (!this.selectedVariation?.addon) return 0;
    return parseInt(this.selectedVariation.addon.addon_item_selection_max);
  }

  getMinSelection(group: AddonDetail): number {
    if (!this.selectedVariation?.addon) return 0;
    return parseInt(this.selectedVariation.addon.addon_item_selection_min);
  }

  isSelected(addon: AddonGroupItem, group: AddonDetail): boolean {
    return this.isAddonSelected(addon, group);
  }

  canSelect(addon: AddonGroupItem, group: AddonDetail): boolean {
    return !this.isAddonDisabled(addon, group);
  }
} 