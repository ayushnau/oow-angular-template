import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ThemeService } from '../../services/theme.service';
import { LogoComponent } from '../logo/logo.component';
import { Timing } from '../../interfaces/theme.interface';
import { FacebookIconComponent, TwitterXIconComponent, InstagramIconComponent, LinkedinIconComponent, YoutubeIconComponent, PinterestIconComponent } from '../../icons/social-icons.component';
import { EmailIconComponent, PhoneIconComponent, LocationIconComponent, ClockIconComponent } from '../../icons/contact-icons.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    LogoComponent,
    FacebookIconComponent,
    TwitterXIconComponent,
    InstagramIconComponent,
    LinkedinIconComponent,
    YoutubeIconComponent,
    PinterestIconComponent,
    EmailIconComponent,
    PhoneIconComponent,
    LocationIconComponent,
    ClockIconComponent
  ],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private themeService = inject(ThemeService);
  
  readonly store$ = this.themeService.getStore();
  readonly social$ = this.themeService.getSocial();
  readonly pages$ = this.themeService.getPages();
  readonly timing$ = this.themeService.getTiming();
  readonly domainPages$ = this.themeService.getDomainPages();

  isLegalVisible = false;
  isInformationVisible = false;
  isContactVisible = false;
  window = window; // Make window available to template

  toggleLegalVisibility() {
    this.isLegalVisible = !this.isLegalVisible;
  }

  toggleInformationVisibility() {
    this.isInformationVisible = !this.isInformationVisible;
  }

  toggleContactVisibility() {
    this.isContactVisible = !this.isContactVisible;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  handleRedirect(url: string) {
    if (!url) {
      console.error('No URL provided for redirection.');
      return;
    }
    window.open(url, '_blank');
  }

  get todaysDay(): keyof Timing {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    return days[new Date().getDay()];
  }
}