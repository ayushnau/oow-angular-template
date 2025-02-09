import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { ThemeService } from '../../../services/theme.service';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
// import { motion } from '@angular/platform-browser/animations';
import { firstValueFrom, Subscription, Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartPopupService } from '../../../services/cart-popup.service';
import { CartItem } from '../../../interfaces/cart.interface';
import { ItemNoteIconComponent, ItemDeleteIconComponent, CartIconComponent } from '../../../icons/cartpop-icons.component';

@Component({
  selector: 'app-cart-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, ItemNoteIconComponent, ItemDeleteIconComponent, CartIconComponent],
  templateUrl: './cart-popup.component.html',
//   animations: [
//     motion.animation([
//       motion.style({ opacity: 0 }),
//       motion.animate('300ms ease-in', motion.style({ opacity: 1 }))
//     ])
//   ]
})
export class CartPopupComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  themeService = inject(ThemeService);
  private store = inject(Store);
  cartPopupService = inject(CartPopupService);

  items: CartItem[] = [];
  orderNotes = '';
  loading = false;
  visibleNoteIndex: number | null = null;
  storeId: string = '';
  reloadData: boolean = false;
  private subscription = new Subscription();
  private orderNotesSubject = new Subject<string>();

  // get storeId(): string {
  //   return this.themeService.store.store_id;
  // }

  ngOnInit() {
    this.themeService.getStore().subscribe(store => {
      if (store?.store_id) {
        this.storeId = store.store_id;
        this.loadCartData();
      }
    });
    document.body.style.overflow = 'hidden';
    // Subscribe to cart items updates
    this.subscription.add(
      this.cartService.cartItems$.subscribe(items => {
        this.items = items;
      })
    );

    // Add debounced order notes handler
    this.subscription.add(
      this.orderNotesSubject.pipe(
        debounceTime(500), // Wait 500ms after the last change
        distinctUntilChanged() // Only emit if value has changed
      ).subscribe(notes => {
        this.updateOrderNotes(notes);
      })
    );
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    this.subscription.unsubscribe();
  }

  async loadCartData() {
    this.loading = true;
    try {
      // Make all three API calls in parallel
      const [orderNotes, cartItems, reloadCart] = await firstValueFrom(
        forkJoin([
          this.cartService.getOrderNotes(this.storeId),
          this.cartService.getItemCart(this.storeId),
          this.cartService.reloadCartItems(),
          this.cartService.getCartCount()
        ])
      );

      // Handle order notes response
      if (orderNotes?.results?.notes) {
        this.orderNotes = orderNotes.results.notes;
      }

      // Handle cart items response
      if (cartItems?.results) {
        this.items = cartItems.results;
        this.cartService.cartItemsSubject.next(cartItems.results);
      }

      // Handle reload cart response
      if (reloadCart?.results) {
        this.reloadData = true;
      }

    } catch (error) {
      console.error('Error loading cart data:', error);
    } finally {
      this.loading = false;
    }
  }

  async updateItemQuantity(item: CartItem, newQuantity: number) {
    if (!this.storeId) return;
    
    try {
      await firstValueFrom(this.cartService.updateQuantity(item._id, newQuantity));
      await this.loadCartData();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  removeItem(itemId: string) {
    if (!this.storeId) return;
    
    try {
      this.cartService.removeItemFromCart({
        storeId: this.storeId,
        cartProductId: itemId
      }).subscribe(() => {
        this.loadCartData();
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  async addNotes(itemId: string, notes: string) {
    if (!this.storeId) return;
    
    try {
      await firstValueFrom(this.cartService.addNotesToItem({
        storeId: this.storeId,
        item_id: itemId,
        notes: notes
      }));
      await this.loadCartData();
    } catch (error) {
      console.error('Error adding notes:', error);
    }
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.total * item.quantity), 0);
  }

  toggleNotes(index: number) {
    this.visibleNoteIndex = this.visibleNoteIndex === index ? null : index;
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('cart-overlay')) {
      this.cartPopupService.close();
    }
  }

  onNotesChange(item: CartItem) {
    this.cartService.updateNotes(item._id, item.notes || '');
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(itemId, quantity).subscribe();
    }
  }

  // Handle order notes changes
  onOrderNotesChange(notes: string) {
    this.orderNotesSubject.next(notes);
  }

  // Update order notes API call
  private async updateOrderNotes(notes: string) {
    if (!this.storeId) return;

    try {
      await firstValueFrom(this.cartService.addOrderNotes({
        storeId: this.storeId,
        notes: notes
      }));
    } catch (error) {
      console.error('Error updating order notes:', error);
    }
  }
} 