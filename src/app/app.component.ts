import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/Footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './services/theme.service';
import { ToastComponent } from './components/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <app-toast />
  `
})  
export class AppComponent {
  title = 'template-angular';
  restaurantId = 'hi thgere ';
  constructor(private themeService: ThemeService) {
    this.themeService.initializeTheme();
  }
}