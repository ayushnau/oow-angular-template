import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FoodCardComponent } from '../../components/food/food-card/food-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bestseller',
  standalone: true,
  imports: [CommonModule, FoodCardComponent],
  templateUrl: './bestseller.component.html',
  styleUrls: ['./bestseller.component.scss']
})
export class BestsellerComponent implements OnInit, OnDestroy {
  private menuService = inject(MenuService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private store = inject(Store);
  private router = inject(Router);
  private subscriptions = new Subscription();

  bestProducts: any[] = [];
  isLoading = false;
  favoriteItems: string[] = [];
  cartItems: any[] = [];

  ngOnInit() {
    console.log('BestsellerComponent initialized');
    this.loadBestProducts();
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadBestProducts() {
    this.isLoading = true;
    console.log('Loading best products...');
    
    this.subscriptions.add(
      this.store.select((state: any) => {
        console.log('Current state:', state); // Debug current state
        return state.themes?.store?.menusharingcode;
      })
      .subscribe({
        next: (code) => {
          console.log('Menu sharing code:', code);
          if (!code) {
            console.warn('No menu sharing code available');
            this.isLoading = false;
            return;
          }
          
          this.menuService.getBestProducts(code).subscribe({
            next: (response: any) => {
              console.log('Best products response:', response);
              this.bestProducts = response.results;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error loading best products:', error);
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          console.error('Error getting menu sharing code:', error);
          this.isLoading = false;
        }
      })
    );
  }

  private setupSubscriptions() {
    // Subscribe to cart items
    this.subscriptions.add(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
      })
    );

    // Subscribe to auth state and load favorites if authenticated
    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.loadFavoriteItems();
        }
      })
    );
  }

  private loadFavoriteItems() {
    this.subscriptions.add(
      this.menuService.getItemFavoriteList().subscribe({
        next: (response: any) => {
          if (response?.results?.item_id) {
            this.favoriteItems = response.results.item_id;
          }
        },
        error: (error) => {
          console.error('Error loading favorite items:', error);
        }
      })
    );
  }

  isItemInCart(item: any) {
    return this.cartItems.find(cartItem => cartItem.item_id === item.item_id);
  }

  navigateToMenu() {
    this.router.navigate(['/menu']);
  }
} 