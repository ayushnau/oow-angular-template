import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hammer-links',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="text-[var(--temp-back)]"
      (click)="toggleMenu()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    </button>

    @if (isOpen) {
      <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
        <!-- Add your menu items here -->
      </div>
    }
  `
})
export class HammerLinksComponent {
  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
} 