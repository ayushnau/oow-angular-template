import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heart-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" class="cursor-pointer">
      <path d="M20.8405 4.77676C20.3297 4.26576 19.7233 3.8604 19.0558 3.58384C18.3884 3.30728 17.673 3.16493 16.9505 3.16493C16.228 3.16493 15.5126 3.30728 14.8451 3.58384C14.1777 3.8604 13.5712 4.26576 13.0605 4.77676L12.0005 5.83676L10.9405 4.77676C9.90879 3.74507 8.50952 3.16547 7.05049 3.16547C5.59145 3.16547 4.19218 3.74507 3.16049 4.77676C2.12879 5.80845 1.54919 7.20772 1.54919 8.66676C1.54919 10.1258 2.12879 11.5251 3.16049 12.5568L4.22048 13.6168L12.0005 21.3968L19.7805 13.6168L20.8405 12.5568C21.3515 12.046 21.7568 11.4396 22.0334 10.7721C22.31 10.1047 22.4523 9.38925 22.4523 8.66676C22.4523 7.94427 22.31 7.22886 22.0334 6.5614C21.7568 5.89394 21.3515 5.28751 20.8405 4.77676V4.77676Z" 
        [attr.stroke]="filled ? 'red' : 'currentColor'" 
        [attr.fill]="filled ? 'red' : 'none'"
        stroke-width="1.3" 
        stroke-linecap="round" 
        stroke-linejoin="round">
      </path>
    </svg>
  `
})
export class HeartIconComponent {
  @Input() filled: boolean = false;
}

@Component({
  selector: 'app-veg-icon',
  standalone: true,
  template: `
    <div class="h-4 w-4 border border-green-600 flex items-center justify-center cursor-pointer">
      <div class="h-2 w-2 bg-green-600 rounded-full"></div>
    </div>
  `
})
export class VegIconComponent {}

@Component({
  selector: 'app-info-arrow-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.00356 13.4C4.73189 13.1333 4.73189 12.7008 5.00356 12.4341L9.52035 7.99998L5.00356 3.5658C4.73189 3.29911 4.73189 2.8667 5.00356 2.6C5.27523 2.3333 5.71569 2.3333 5.98736 2.6L10.9961 7.51707C11.2677 7.78377 11.2677 8.21618 10.9961 8.48288L5.98736 13.4C5.71569 13.6667 5.27523 13.6667 5.00356 13.4Z" 
        fill="#0C1D2E">
      </path>
    </svg>
  `
})
export class InfoArrowIconComponent {}

@Component({
  selector: 'app-minus-icon',
  standalone: true,
  template: `
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" 
      class="text-[var(--temp-back)] hover:text-white border-[var(--temp-back)] border bg-white hover:bg-[var(--temp-back)] p-1 rounded-full cursor-pointer"
      height="25" width="25">
      <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"></path>
    </svg>
  `
})
export class MinusIconComponent {}

@Component({
  selector: 'app-plus-icon',
  standalone: true,
  template: `
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" 
      class="text-[var(--temp-back)] hover:text-white border-[var(--temp-back)] border bg-white hover:bg-[var(--temp-back)] p-1 rounded-full cursor-pointer"
      height="25" width="25">
      <path d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"></path>
    </svg>
  `
})
export class PlusIconComponent {} 