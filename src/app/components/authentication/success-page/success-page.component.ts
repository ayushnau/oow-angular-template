import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef, DialogModule } from '@angular/cdk/dialog';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [CommonModule, DialogModule],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0,
          transform: 'translate(-50%, -48%) scale(0.95)'
        }),
        animate('200ms ease-out', style({ 
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ 
          opacity: 0,
          transform: 'translate(-50%, -48%) scale(0.95)'
        }))
      ])
    ]),
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" @backdropAnimation></div>
    <div class="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      <div 
        role="dialog" 
        class="w-full sm:max-w-[425px] translate-x-[-50%] sm:translate-y-[-50%] fixed left-[50%] sm:top-[50%] bottom-0 sm:bottom-auto border bg-white shadow-lg rounded-t-[32px] sm:rounded-[24px]"
        @dialogAnimation
      >
        <div class="relative w-full h-full">
          <!-- Close Button -->
          <button 
            type="button" 
            (click)="dialogRef.close()"
            class="absolute right-6 top-6 rounded-full p-2 opacity-70 hover:bg-gray-100 transition-all duration-200"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" 
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
            </path>
          </svg>
        </button>

        <!-- Success Content -->
        <div class="p-8">
          <div class="flex flex-col gap-8 items-center">
            <!-- Success Icon -->
            <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg 
                class="w-10 h-10 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <!-- Success Message -->
            <div class="flex flex-col gap-2 text-center">
              <h2 class="text-2xl font-semibold text-gray-900">Welcome Back!</h2>
              <p class="text-gray-600">You have successfully logged in to your account</p>
            </div>

            <!-- Continue Button -->
            <button 
              (click)="closeDialog()"
              class="w-full h-12 rounded-xl font-medium transition-all duration-200 
                     bg-white hover:bg-temp text-temp hover:text-white 
                     border-2 border-temp
                     focus:outline-none focus:ring-2 focus:ring-temp focus:ring-offset-2"
            >
              Continue to Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SuccessPageComponent {
  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: { changePage: (page: number) => void }
  ) {}

  closeDialog() {
    this.dialogRef.close();
    // Additional logic after successful login (e.g., refresh user state, redirect)
    window.location.reload(); // Or use Router for better navigation
  }
} 