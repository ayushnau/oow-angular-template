import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { storeConfig } from './store/store.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastService } from './services/toast.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ...storeConfig,
    provideAnimations(),
    ToastService,
  ]
};
