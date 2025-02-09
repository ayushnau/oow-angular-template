import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem, Nutrition } from '../../../interfaces/food.interface';

@Component({
  selector: 'app-variation-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-h-fit">
      <div class="overflow-y-auto max-h-[80vh]">
        <!-- Image and Details Section -->
        <div class="sm:px-[3.8%] sm:pt-[3.8%] sm:pb-[2.2%] gap-4 rounded-t-[10px] w-full sm:flex">
          <!-- Image Section -->
          <div class="min-w-[35%] h-[30vh]">
            <img [src]="item.item_image_url" 
                 [alt]="item.item_name" 
                 class="w-full flex-shrink-0 h-full rounded-t-[10px] sm:rounded-[10px] object-cover">
          </div>
          
          <!-- Details Section -->
          <div class="w-full p-4">
            <span class="flex justify-between items-center">
              <div class="flex gap-2">
                <div class="flex py-1">
                  <div>
                    <div class="h-4 w-4 border border-green-600 flex items-center justify-center cursor-pointer">
                      <div class="h-2 w-2 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <h2 class="text-[16px] text-[#0C1D2E] font-semibold flex flex-wrap items-center gap-2">
                  {{item.item_name}}
                  <span><p class="text-sm">({{selectedVariation?.name || 'Select Size'}})</p></span>
                </h2>
              </div>
              <!-- Heart Icon -->
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" class="cursor-pointer">
                  <path d="M20.8405 4.77676C20.3297 4.26576 19.7233 3.8604 19.0558 3.58384C18.3884 3.30728 17.673 3.16493 16.9505 3.16493C16.228 3.16493 15.5126 3.30728 14.8451 3.58384C14.1777 3.8604 13.5712 4.26576 13.0605 4.77676L12.0005 5.83676L10.9405 4.77676C9.90879 3.74507 8.50952 3.16547 7.05049 3.16547C5.59145 3.16547 4.19218 3.74507 3.16049 4.77676C2.12879 5.80845 1.54919 7.20772 1.54919 8.66676C1.54919 10.1258 2.12879 11.5251 3.16049 12.5568L4.22048 13.6168L12.0005 21.3968L19.7805 13.6168L20.8405 12.5568C21.3515 12.046 21.7568 11.4396 22.0334 10.7721C22.31 10.1047 22.4523 9.38925 22.4523 8.66676C22.4523 7.94427 22.31 7.22886 22.0334 6.5614C21.7568 5.89394 21.3515 5.28751 20.8405 4.77676V4.77676Z" 
                        stroke="red" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="red"></path>
                </svg>
              </div>
            </span>
            
            <!-- Calories -->
            <p class="text-[14px] text-[#748BA0] font-[400] cursor-pointer">
              {{nutrition?.["calories"]?.amount || 0}} kcal - {{nutrition?.["protien"]?.amount || 0}}g
            </p>
            
            <!-- Price -->
            <div class="lg:text-[20px] text-[16px] pt-[12px] sm:mb-4 flex items-center">
              <div class="font-[550] pr-[2px]">INR</div>
              {{selectedVariation?.price || item.price}}.00
            </div>
            
            <!-- Quantity Controls -->
            <div class="flex gap-[5%] justify-end items-end pt-[1%]">
              <div class="sm:w-[15%] w-[12%] sm:h-[7.8vh] h-[6vh] rounded-[10px] flex justify-center items-center bg-[#edf0f0] cursor-pointer">
                <!-- Note Icon SVG -->
              </div>
              <div class="w-[38%] sm:h-[7.8vh] h-[6vh] p-[13px] rounded-[10px] gap-[31%] flex justify-center items-center bg-[#edf0f0]">
                <!-- Quantity Controls -->
              </div>
            </div>
          </div>
        </div>

        <!-- Variation Selector -->
        <div class="mx-[3.8%] rounded-[10px] border-2 border-[hsl(var(--border))] mb-2">
          <div class="flex justify-between items-center border-b-2 border-[hsl(var(--border))] py-[1%] cursor-pointer">
            <p class="px-[16px]">Variation</p>
            <p class="px-[16px]">
              <svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.599927 6.99625C0.866626 7.26791 1.29903 7.26791 1.56573 6.99625L5.9999 2.47945L10.4341 6.99625C10.7008 7.26791 11.1332 7.26791 11.3999 6.99625C11.6666 6.72458 11.6666 6.28411 11.3999 6.01244L6.4828 1.00375C6.21611 0.732079 5.7837 0.732079 5.517 1.00375L0.599927 6.01244C0.333227 6.28411 0.333227 6.72458 0.599927 6.99625Z" fill="#0C1D2E"></path>
              </svg>
            </p>
          </div>
          <div class="overflow-y-auto max-h-[150px] px-[16px]">
            @for (variation of item.variation; track variation.variationid) {
              <div class="flex justify-between items-center py-1 max-h-[20vh] custom-scrollbar overflow-y-auto relative">
                <span class="cursor-pointer" 
                      [class.text-[var(--temp-back)]]="selectedVariation?.variationid === variation.variationid">
                  <input type="radio" 
                         class="mr-2" 
                         [checked]="selectedVariation?.variationid === variation.variationid"
                         (click)="onVariationSelect(variation)"
                         readonly>
                  {{variation.name}}
                </span>
                <span class="text-gray-500 flex items-center">
                  <div class="font-[550] pr-[2px]">INR</div>
                  {{variation.price}}.00
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `]
})
export class VariationSelectorComponent {
  @Input() item!: FoodItem;
  @Input() selectedVariation: any;
  @Output() selectedVariationChange = new EventEmitter<any>();
  nutrition: Nutrition | null = null;

  ngOnInit() {
    // Parse nutrition string to object if it exists
    if (this.item?.nutrition && typeof this.item.nutrition === 'string') {
      try {
        this.nutrition = JSON.parse(this.item.nutrition);
      } catch (e) {
        console.error('Error parsing nutrition data:', e);
        this.nutrition = null;
      }
    }
  }

  get uniqueVariations() {
    return Array.from(
      new Map(
        this.item.variation.map(v => [v.variationid, v])
      ).values()
    );
  }

  onVariationSelect(variation: any) {
    this.selectedVariation = variation;
    this.selectedVariationChange.emit(variation);
  }
} 