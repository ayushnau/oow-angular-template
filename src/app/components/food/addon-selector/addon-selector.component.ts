import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem } from '../../../interfaces/food.interface';

@Component({
  selector: 'app-addon-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mx-[3.8%] mb-2">
      @for (group of item.addonDetails; track group.addon_group_id) {
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
                         [id]="'addon-' + group.addon_group_id + '-' + addon.addonitemid"
                         class="mr-2"
                         [checked]="isSelected(addon, group)"
                         [disabled]="!canSelect(addon, group)"
                         (change)="onAddonSelect(addon, group)">
                  <label [for]="'addon-' + group.addon_group_id + '-' + addon.addonitemid" 
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
export class AddonSelectorComponent {
  @Input() item!: FoodItem;
  @Input() selectedAddons: any[] = [];
  @Output() selectedAddonsChange = new EventEmitter<any[]>();

  getSelectionRange(group: any) {
    const addon = this.item.addon.find(a => a.addon_group_id === group.addon_group_id);
    const min = addon?.addon_item_selection_min || 0;
    const max = addon?.addon_item_selection_max || 1;
    return min === max ? min : `${min}-${max}`;
  }

  isAddonSelected(addon: any, group: any) {
    return this.selectedAddons.some(selected => 
      selected.addonitemid === addon.addonitemid && 
      selected.addon_group_id === group.addon_group_id
    );
  }

  isAddonDisabled(addon: any, group: any) {
    const addon_config = this.item.addon.find(
      a => a.addon_group_id === group.addon_group_id
    );
    
    const selectedCount = this.selectedAddons.filter(
      selected => selected.addon_group_id === group.addon_group_id
    ).length;
    return false;
    // return selectedCount >= addon_config?.addon_item_selection_max && 
    //        !this.isAddonSelected(addon, group);
  }

  onAddonSelect(addon: any, group: any) {
    let newSelectedAddons = [...this.selectedAddons];
    
    if (this.isAddonSelected(addon, group)) {
      newSelectedAddons = newSelectedAddons.filter(
        selected => !(selected.addonitemid === addon.addonitemid && 
                     selected.addon_group_id === group.addon_group_id)
      );
    } else {
      newSelectedAddons.push({
        ...addon,
        addon_group_id: group.addon_group_id,
        addon_group_name: group.addon_group_name
      });
    }
    
    this.selectedAddonsChange.emit(newSelectedAddons);
  }

  getSelectedCount(group: any) {
    return this.selectedAddons.filter(addon => addon.addon_group_id === group.addon_group_id).length;
  }

  getMaxSelection(group: any) {
    const addon = this.item.addon.find(a => a.addon_group_id === group.addon_group_id);
    return addon?.addon_item_selection_max || 1;
  }

  getMinSelection(group: any) {
    const addon = this.item.addon.find(a => a.addon_group_id === group.addon_group_id);
    return addon?.addon_item_selection_min || 0;
  }

  canSelect(addon: any, group: any) {
    const addon_config = this.item.addon.find(
      a => a.addon_group_id === group.addon_group_id
    );
    const selectedCount = this.selectedAddons.filter(
      selected => selected.addon_group_id === group.addon_group_id
    ).length;
    return selectedCount < parseInt(addon_config?.addon_item_selection_max || '0');
  }

  isSelected(addon: any, group: any) {
    return this.selectedAddons.some(selected => 
      selected.addonitemid === addon.addonitemid && 
      selected.addon_group_id === group.addon_group_id
    );
  }
} 