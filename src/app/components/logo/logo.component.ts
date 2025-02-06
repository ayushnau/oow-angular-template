import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { map } from 'rxjs/operators';
import { ThemeData } from '../../interfaces/theme.interface';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  template: `
    @if (logo$ | async; as logo) {
      <a [routerLink]="['/']" class="cursor-pointer">
        <img 
          [src]="logo"
          [alt]="isHeader ? 'DineHub Logo' : 'DineHub White Logo'"
          class="h-full w-full object-contain"
        >
      </a>
    }
  `
})
export class LogoComponent {
  @Input() isHeader: boolean = false;
  private themeService = inject(ThemeService);
  
  readonly social$ = this.themeService.getTheme();
  readonly logo$ = this.social$.pipe(
    map((theme: ThemeData | null) => theme?.Logo || '')
  );
} 