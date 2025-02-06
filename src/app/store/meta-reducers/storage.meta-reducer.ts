import { ActionReducer, Action } from '@ngrx/store';

export function storageMetaReducer(reducer: ActionReducer<any>) {
  return function(state: any, action: Action) {
    const nextState = reducer(state, action);
    
    // Skip saving to localStorage during initialization
    if (action.type !== '@ngrx/store/init') {
      localStorage.setItem('appState', JSON.stringify(nextState));
    }
    
    return nextState;
  };
}

export function hydrationMetaReducer(reducer: ActionReducer<any>) {
  return function(state: any, action: Action) {
    if (action.type === '@ngrx/store/init') {
      const storageValue = localStorage.getItem('appState');
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('appState');
        }
      }
    }
    return reducer(state, action);
  };
}
