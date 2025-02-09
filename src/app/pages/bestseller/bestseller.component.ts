import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FoodCardComponent } from '../../components/food/food-card/food-card.component';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { FoodItem } from '../../interfaces/food.interface';

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
  private themeService = inject(ThemeService);
  private subscriptions = new Subscription();

  bestProducts: FoodItem[] = [];
  isLoading = true;
  favoriteItems: string[] = [];
  cartItems: any[] = [];

  constructor(private router: Router) {}

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
      this.themeService.getStore().subscribe({
        next: (store) => {
          if (!store?.menusharingcode) {
            this.isLoading = false;
            return;
          }
          
          this.subscriptions.add(
            this.menuService.getBestProducts(store.menusharingcode).subscribe({
              next: (response: any) => {
                console.log('Best products response:', response);
                this.bestProducts = response.results;
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error loading best products:', error);
                this.isLoading = false;
              }
            })
          );
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