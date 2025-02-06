import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse, ThemeData, StoreDetails } from '../interfaces/theme.interface';
import { Store } from '@ngrx/store';
import { selectDomainPages, selectPages, selectSocial, selectTiming, ThemeActions } from '../store/slices/theme.slice';
import { selectStoreName, selectLogo, selectThemeColors, selectStore, selectTheme } from '../store/slices/theme.slice';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private ngrxStore = inject(Store);
  private http = inject(HttpClient);
  
  private loading = signal(false);
  private error = signal<string | null>(null);
  
  private themeData = signal<ThemeData | null>(null);
  private storeData = signal<StoreDetails | null>(null);

  // Computed signals for derived state
  readonly isLoading = computed(() => this.loading());
  readonly currentError = computed(() => this.error());
  readonly theme = computed(() => this.themeData());
  readonly storeDetails = computed(() => this.storeData());

  // Store selectors
  getStoreName() {
    return this.ngrxStore.select(selectStoreName);
  }

  getLogo() {
    return this.ngrxStore.select(selectLogo);
  }

  getThemeColors() {
    return this.ngrxStore.select(selectThemeColors);
  }

  getStore() {
    return this.ngrxStore.select(selectStore);
  }

  getTheme() {
    return this.ngrxStore.select(selectTheme);
  }

  getSocial() {
    return this.ngrxStore.select(selectSocial);
  }

  getPages() {
    return this.ngrxStore.select(selectPages);
  }

  getTiming() {
    return this.ngrxStore.select(selectTiming);
  }

  getDomainPages() {
    return this.ngrxStore.select(selectDomainPages);
  }

  public initializeTheme() {
    this.loading.set(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'access-control-allow-credentials': 'true'
    });

    const payload = {
      domain: environment.DOMAIN
    };

    return this.http.post<ApiResponse>(
      `${environment.API_URL}/theme/active`,
      payload,
      { headers }
    ).subscribe({
      next: (response) => {
        if (response.code === 201) {
          this.ngrxStore.dispatch(ThemeActions.setThemeData({
            theme: response.results.theme,
            store: response.results.store,
            social: response.results.social,
            pages: response.results.pages,
            timing: response.results.timing,
            domainPages: response.results.domainPages
          }));
          
          const colors = response?.results?.theme?.colors?.current;
          if (colors?.primary) {
            document.documentElement.style.setProperty('--temp-back', colors.primary);
          }
          if (colors?.secondary) {
            document.documentElement.style.setProperty('--temp-sec-back', colors.secondary);
          }
  
          // Update the favicon
          if (response?.results?.theme?.Favicon) {
            const favicon: HTMLLinkElement | null = document.getElementById('favicon') as HTMLLinkElement;
            if (favicon) {
              favicon.href = response?.results?.theme?.Favicon;
            }
          }
  
          // Handle custom fonts dynamically
          if (response?.results?.theme?.font) {
            const resData = response?.results?.theme?.font;
            let currentFont = 'DM Sans';
            if (resData === 'Sans Serif') currentFont = 'Open Sans';
            if (resData === 'Inter') currentFont = 'Inter';
            if (resData === 'Modern') currentFont = 'Playfair Display';
            if (resData === 'Times Roman') currentFont = 'Frank Ruhl Libre';
            if (resData === 'Sans') currentFont = 'Inter';
  
            document.documentElement.style.setProperty('--current-font-back', currentFont);
          }
          console.log('Theme data stored:', response.results);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Theme initialization error:', err);
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  // Method to refresh theme data if needed
  refreshTheme() {
    this.initializeTheme();
  }
} 