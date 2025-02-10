import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CartItem {
  _id: string;
  item_id: string;
  item_name: string;
  item_image_url: string;
  item_description?: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  addons_details: Array<{
    addon_group_items: {
      addonitem_name: string;
      price: number;
    }
  }>;
  variation?: string;
  items_details: {
    item_name: string;
    variation?: {
      name: string;
    }
  };
}

// <textarea
// [(ngModel)]="orderNotes"
// (change)="updateOrderNotes()"
// class="bg-[#E6F3F8] rounded-lg w-full pt-2 px-4 outline-none text-sm resize-none"
// rows="3"
// placeholder="Add special Notes">
// </textarea>

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-lg">
      <div class="lg:bg-white rounded-lg pt-4">
        <!-- Header -->
        <div class="border-2 bg-white lg:border-none mx-4 px-4 py-6 rounded-xl">
          <div class="flex flex-col gap-2 lg:border-b-2">
            <div class="flex justify-between items-center">
              <p class="text-base font-semibold">Order Summary</p>
              <button class="bg-[#E9F3F6] text-xs py-1 px-5 rounded-md">
                {{ orderType }}
              </button>
            </div>
            <div class="flex justify-between items-center mb-2">
              <p class="text-sm">{{ (cartItems$ | async)?.length || 0 }} Items</p>
              <p class="text-[#748BA0] text-xs" *ngIf="isDelivery">
                Estimated delivery: {{ deliveryTime }} mins
              </p>
            </div>
          </div>

          <!-- Cart Items -->
          <div class="max-h-[56vh] overflow-y-auto">
            <div *ngFor="let item of cartItems$ | async" class="lg:mx-4 lg:border-2 lg:rounded-lg my-3 py-1 relative">
              <div class="lg:px-4">
                <!-- Item Header -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <p class="text-sm">{{ item.items_details.item_name }}
                      <span *ngIf="item.variation" class="text-sm">
                        ({{ item.items_details.variation?.name }})
                      </span>
                    </p>
                  </div>
                  <div class="flex text-sm">
                    {{ getCurrencySymbol() }} {{ formatPrice(item.total * item.quantity) }}
                  </div>
                </div>

                <!-- Addons -->
                <div *ngIf="item.addons_details.length > 0" class="flex mt-1 lg:ml-[10%]">
                  <p class="text-[#748BA0] text-xs">
                    (Add-on: {{ getAddonNames(item.addons_details) }})
                  </p>
                </div>

                <!-- Quantity Controls -->
                <div class="flex justify-between items-center mt-2">
                  <div class="flex items-center space-x-4">
                    <button (click)="updateQuantity(item, -1)" 
                            class="p-1 rounded-full bg-gray-100">-</button>
                    <span class="font-semibold text-[#748BA0]">{{ item.quantity }}</span>
                    <button (click)="updateQuantity(item, 1)"
                            class="p-1 rounded-full bg-gray-100">+</button>
                  </div>
                  <button (click)="removeItem(item)" 
                          class="text-red-500 text-sm">Remove</button>
                </div>

                <!-- Notes -->
                <input *ngIf="item.notes !== undefined"
                       type="text"
                       [value]="item.notes"
                       (change)="updateNotes(item, $event)"
                       placeholder="Add Note"
                       class="text-[#748BA0] py-1.5 my-2 rounded-lg text-sm px-2 w-full border outline-none">
              </div>
            </div>
          </div>

          <!-- Order Notes -->
          <div class="lg:mx-4 mt-2">
           
          </div>

          <!-- Actions -->
          <div class="mx-4">
            <button (click)="addMoreItems()"
                    class="w-full flex justify-center items-center bg-white hover:bg-[#primary] border-2 border-[#primary] my-4 text-[#primary] hover:text-white font-bold text-sm py-2 rounded-lg">
              + Add More Items
            </button>
            <button (click)="confirmOrder()"
                    [disabled]="isProcessing || !(cartItems$ | async)?.length"
                    class="w-full flex justify-center items-center bg-[#primary] text-white font-bold text-sm py-2 rounded-lg">
              {{ isProcessing ? 'Processing...' : 'Confirm Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartSummaryComponent implements OnInit {
  @Input() orderType: 'DELIVERY' | 'PICKUP' = 'DELIVERY';
  @Input() deliveryTime: number = 30;
  @Output() orderConfirmed = new EventEmitter<void>();

  cartItems$: Observable<CartItem[]>;
  isProcessing = false;
  orderNotes: string = '';
  isDelivery: boolean = true;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.isDelivery = this.orderType === 'DELIVERY';
  }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe();

    // Initialize component
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity < 0) return;
    
    if (newQuantity === 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item._id, newQuantity).subscribe();
    }
  }

  removeItem(item: CartItem): void {
    // this.cartService.removeItemFromCart({storeId: this.storeId, cartProductId: item._id}).subscribe();
  }

  updateNotes(item: CartItem, event: Event): void {
    const notes = (event.target as HTMLInputElement).value;
    this.cartService.updateItemNotes(item._id, notes).subscribe();
  }

  updateOrderNotes(): void {
    // this.cartService.updateOrderNotes(this.orderNotes).subscribe();
  }

  getAddonNames(addons: any[]): string {
    return addons
      .map(addon => addon.addon_group_items?.addonitem_name)
      .filter(Boolean)
      .join(', ');
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  getCurrencySymbol(): string {
    return '₹'; // Or get from a config service
  }

  addMoreItems(): void {
    this.router.navigate(['/menu']);
  }

  confirmOrder(): void {
    this.isProcessing = true;
    // Implement order confirmation logic
    this.orderConfirmed.emit();
    this.isProcessing = false;
  }
}