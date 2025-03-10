import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CartResponse, OrderNotesResponse } from '../interfaces/cart.interface';
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ThemeService } from './theme.service';
import { AddonGroupItem, FoodItem } from '../interfaces/food.interface';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private themeService = inject(ThemeService);
  private toast = inject(ToastService);
  private baseUrl = environment.API_URL;
  
  private notesSubject = new Subject<{itemId: string, notes: string}>();
  public cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();
  
  storeId: string = '';
  constructor() {
    this.notesSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(({itemId, notes}) => this.updateItemNotes(itemId, notes))
    ).subscribe();

    this.themeService.getStore().subscribe(store => {
      if (store?.store_id) {
        this.storeId = store.store_id;
      }
    });
  }

  // Add to cart sequence
  addToCart(item: FoodItem, variation: string = '', addons: AddonGroupItem[] = [], notes: string = '') {
    const payload = {
      storeId: this.storeId,
      item_id: item.item_id,
      variation: variation,
      quantity: 1,
      addons: addons,
      notes: notes
    };

    return this.http.post(`${this.baseUrl}/user/add_item_to_cart`, payload, {
      headers: this.getHeaders()
    }).pipe(
      switchMap(() => this.getCartItems()),
      tap(() => this.getCartCount().subscribe()),
      tap(() => this.toast.success('Item added to cart'))
    );
  }

  // Update quantity sequence
  updateQuantity(cartProductId: string, quantity: number): Observable<any> {
    const payload = {
      storeId: this.storeId,
      cartProductId,
      quantity
    };

    return this.http.patch(`${this.baseUrl}/user/change_product_quantity`, payload, {
      headers: this.getHeaders()
    }).pipe(
      // switchMap(() => this.getCartItems()),
      // tap(() => this.getCartCount().subscribe())
      tap(() => this.refreshCartData()),
      tap(() => this.toast.success('Quantity updated'))
    );
  }

  getItemCart(storeId: string): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/user/get_item_cart/${storeId}`, {
      headers: this.getHeaders()
    });
  }

  getOrderNotes(storeId: string): Observable<OrderNotesResponse> {
    return this.http.get<OrderNotesResponse>(`${this.baseUrl}/user/get_order_notes/${storeId}`, {
      headers: this.getHeaders()
    });
  }
  addOrderNotes(data: { storeId: string; notes: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/add_order_notes`, data, {
      headers: this.getHeaders()
    });
  }

  reloadCartItems(): Observable<{ results: boolean; message: string; code: number }> {
    return this.http.get<{ results: boolean; message: string; code: number }>(
      `${this.baseUrl}/user/reload_cart_items`,
      { headers: this.getHeaders() }
    );
  }

  removeItemFromCart(data: { storeId: string; cartProductId: string }): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/remove_cart_product`, {
      body: data,
      headers: this.getHeaders()
    });
  }

  addNotesToItem(data: { storeId: string; item_id: string; notes: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/add_notes_to_item`, data, {
      headers: this.getHeaders()
    });
  }

  updateItemNotes(itemId: string, notes: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/add_note_to_item`, {
      storeId: this.storeId,
      item_id: itemId,
      notes: notes
    }, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.refreshCartData())
    );
  }

  removeCartItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/remove_cart_product`, {
      body: {
        storeId: this.storeId,
        item_id: itemId
      },
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.refreshCartData()),
      tap(() => this.toast.success('Item removed from cart'))
    );
  }

  updateNotes(itemId: string, notes: string) {
    this.notesSubject.next({ itemId, notes });
  }

  private refreshCartData() {
    this.getCartItems().subscribe();
    this.getCartCount().subscribe();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'access-control-allow-credentials': 'true',
      'authorization': `Bearer ${localStorage.getItem('token')}`,
      'storeid': this.storeId
    });
  }

  getCartItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/get_item_cart/${this.storeId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap((response: any) => {
        this.cartItemsSubject.next(response.results);
      })
    );
  }

  getCartCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/get_cart_count/${this.storeId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap((response: any) => {
        console.log(response.results,">>>>chekc the result ")
        this.cartCountSubject.next(response.results);
      })
    );
  }
} 