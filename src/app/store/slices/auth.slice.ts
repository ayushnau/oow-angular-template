import { createFeature, createReducer, on } from '@ngrx/store';
import { createActionGroup, props, emptyProps } from '@ngrx/store';

export interface AuthState {
  user: any | null;
  phone: string;
  countryCode: string;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  phone: '',
  countryCode: '+91',
  isAuthenticated: false
};

// Action group
export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'SetUser': props<{ user: any }>(),
    'SetPhone': props<{ phone: string; countryCode: string }>(),
    'ClearAuth': emptyProps(),
  }
});

// Feature creation with reducer
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.setUser, (state, { user }) => ({
      ...state,
      user,
      isAuthenticated: true
    })),
    on(AuthActions.setPhone, (state, { phone, countryCode }) => {
        alert("setPhone")
    console.log(phone,countryCode,"phone and countryCode")
      return {  ...state,
      phone,
      countryCode}
    }),
    on(AuthActions.clearAuth, () => initialState)
  )
});