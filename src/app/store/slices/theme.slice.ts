import { createFeature, createReducer, createSelector, emptyProps, on } from '@ngrx/store';
import { createActionGroup, props } from '@ngrx/store';
import { ThemeData, StoreDetails, Social, Pages, Timing, DomainPage } from '../../interfaces/theme.interface';

export const ThemeActions = createActionGroup({
  source: 'Theme',
  events: {
    'Set Theme Data': props<{ 
      theme: ThemeData; 
      store: StoreDetails;
      social: Social;
      pages: Pages;
      timing: Timing;
      domainPages: DomainPage[];
    }>(),
    'Clear Theme Data': emptyProps(),
  },
});

export interface ThemeState {
  theme: ThemeData | null;
  store: StoreDetails | null;
  social: Social | null;
  pages: Pages | null;
  timing: Timing | null;
  domainPages: DomainPage[] | null;
}

const initialState: ThemeState = {
  theme: null,
  store: null,
  social: null,
  pages: null,
  timing: null,
  domainPages: null
};

export const themeFeature = createFeature({
  name: 'theme',
  reducer: createReducer(
    initialState,
    on(ThemeActions.setThemeData, (state, { theme, store, social, pages, timing, domainPages }) => ({
      ...state,
      theme,
      store,
      social,
      pages,
      timing,
      domainPages
    })),
    on(ThemeActions.clearThemeData, () => initialState)
  ),
});

// Selectors
export const {
  selectTheme,
  selectStore,
  selectSocial,
  selectPages,
  selectTiming,
  selectDomainPages,
} = themeFeature;

// Custom selectors
export const selectStoreName = createSelector(
  selectStore,
  (store) => store?.name || ''
);

export const selectLogo = createSelector(
  selectTheme,
  (theme) => theme?.Logo || ''
);

export const selectThemeColors = createSelector(
  selectTheme,
  (theme) => theme?.colors?.current || null
); 