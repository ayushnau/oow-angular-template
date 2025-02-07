import { Injectable, signal, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartPopupService {
  private authService = inject(AuthService);
  isOpen = signal(false);

  constructor() {
    // Close cart popup when user logs out
    this.authService.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        this.close();
      }
    });

    // Add global click listener
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Only close if clicking outside cart popup and not on the trigger button
      if (this.isOpen() && 
          !target.closest('.cart-popup-content') && 
          !target.closest('.cart-trigger')) {
        this.close();
      }
    });
  }

  toggle() {
    // if (!this.isOpen() && !this.authService.isAuthenticated()) {
    //   // Don't open if not authenticated
    //   return;
    // }
    this.isOpen.update(value => !value);
  }

  open() {
    if (this.authService.isAuthenticated()) {
      this.isOpen.set(true);
    }
  }

  close() {
    this.isOpen.set(false);
  }
} 