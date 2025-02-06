import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastData } from '../../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ol 
      class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    >
      @for (toast of toasts; track toast.id) {
        <li 
          role="status" 
          aria-live="off" 
          aria-atomic="true" 
          tabindex="0" 
          data-state="open"
          class="group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md p-4 pr-6 shadow-lg transition-all border bg-background text-foreground
                 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 
                 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full 
                 data-[state=open]:sm:slide-in-from-bottom-full"
          [class.bg-destructive]="toast.type === 'error'"
          @toastAnimation
        >
          <div class="grid gap-1">
            @if (toast.type === 'success') {
              <div class="text-sm font-semibold [&+div]:text-xs">Success</div>
            } @else if (toast.type === 'error') {
              <div class="text-sm font-semibold text-destructive-foreground [&+div]:text-xs">Error</div>
            }
            <div class="text-sm opacity-90" [class.text-destructive-foreground]="toast.type === 'error'">
              {{ toast.message }}
            </div>
          </div>
          
          <button 
            type="button" 
            (click)="removeToast(toast.id)"
            class="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity 
                   hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 
                   group-hover:opacity-100"
            [class.text-destructive-foreground]="toast.type === 'error'"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" 
                    fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
              </path>
            </svg>
          </button>
        </li>
      }
    </ol>
  `,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ],
  styles: [`
    :host {
      --destructive: rgb(239 68 68);
      --destructive-foreground: white;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: (ToastData & { id: number })[] = [];
  private counter = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe(data => {
      const id = this.counter++;
      this.toasts.push({ ...data, id });
      
      setTimeout(() => {
        this.removeToast(id);
      }, data.duration || 3000);
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy() {
    this.toasts = [];
  }
} 