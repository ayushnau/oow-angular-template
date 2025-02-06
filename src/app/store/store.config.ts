import { isDevMode } from '@angular/core';
import { provideStore, MetaReducer } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { counterFeature } from './slices/counter.slice';
import { authFeature } from './slices/auth.slice';
import { hydrationMetaReducer, storageMetaReducer } from './meta-reducers/storage.meta-reducer';
import { themeFeature } from './slices/theme.slice';
  
export const metaReducers: MetaReducer[] = [
  hydrationMetaReducer,
  storageMetaReducer
];

export const storeConfig = [
  provideStore(
    {
      counter: counterFeature.reducer,
      auth: authFeature.reducer,
      theme: themeFeature.reducer,
    },
    {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }
  ),
  provideEffects(),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: !isDevMode(),
    trace: true
  })
];
