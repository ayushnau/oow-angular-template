import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({    
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed right-6 top-12 mt-2 w-[110px] bg-white rounded-md shadow-lg py-1 z-50">
      <button
        (click)="logout()"
        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  `
})
export class UserDropdownComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    // here show the snack bar message
    // update this to toast
    this.toast.success('Logged out successfully');
  }
} 