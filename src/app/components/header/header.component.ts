import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { CartSvgComponent } from '../cart-svg/cart-svg.component';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';
import { HammerLinksComponent } from '../hammer-links/hammer-links.component';
import { CartPopupComponent } from './cart-popup/cart-popup.component';
import { EmptyCartComponent } from '../empty-cart/empty-cart.component';
import { Store } from '@ngrx/store';
import { CounterActions } from '../../store/slices/counter.slice';
import { Dialog } from '@angular/cdk/dialog';
import { ThemeService } from '../../services/theme.service';
import { selectLogo, selectStoreName, selectThemeColors } from '../../store/slices/theme.slice';
import { CartPopupService } from '../../services/cart-popup.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    CartSvgComponent,
    AuthenticationComponent,
    UserDropdownComponent,
    HammerLinksComponent,
    CartPopupComponent,
    EmptyCartComponent
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private ngrxStore = inject(Store);
  private themeService = inject(ThemeService);
  cartPopupService = inject(CartPopupService);

  readonly social$ = this.themeService.getSocial();
  readonly storeName$ = this.ngrxStore.select(selectStoreName);
  readonly themeColors$ = this.ngrxStore.select(selectThemeColors);

  isHover = signal(false);
  showCartPopUp = signal(false);
  showEmptyCart = signal(false);
  showUserDropdown = signal(false);
  cartItems = signal<any[]>([]);
  dialog = inject(Dialog);
  userImagePath = `https://i.ibb.co/6cyLcnxM/user.png`;
  cartCount = signal(0);
  
  setHover(value: boolean) {
    this.isHover.set(value);
  }
  constructor(){
  this.showUserDropdown.update(value => {
     return false;
  })
  // here update cartPopupService as close. 
  this.cartPopupService.close();
}


  toggleUserDropdown() {
    console.log('Toggling dropdown');
    this.showUserDropdown.update(value => {
      if(value === false){
        document.body.style.overflow = 'hidden';
      }else{
        document.body.style.overflow = 'auto';
      }
      return!value
    }
  );
    
    // If opening the dropdown, add a click listener to close it when clicking outside
    if (this.showUserDropdown()) {
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdown);
      });
    }
  }

  closeDropdown = (event: MouseEvent) => {
    const dropdown = document.querySelector('.user-dropdown');
    const userImage = document.querySelector('.user-image');
    
    if (dropdown && !dropdown.contains(event.target as Node) && 
        userImage && !userImage.contains(event.target as Node)) {
      this.showUserDropdown.set(false);
      document.removeEventListener('click', this.closeDropdown);
    }
  }

  toggleCartPopUp() {
    this.showCartPopUp.update(value => !value);
  }

  toggleEmptyCart() {
    this.showEmptyCart.update(value => !value);
  }

  isUser(): boolean {

    return localStorage.getItem('token') !== null;
  }

  increaseCartCount() {
    this.ngrxStore.dispatch(CounterActions.increment({ amount: 1 }));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeDropdown);
    document.body.style.overflow = 'auto';
  }
} 