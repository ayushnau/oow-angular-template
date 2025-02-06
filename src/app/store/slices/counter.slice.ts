import { createFeature, createReducer, on } from '@ngrx/store';
import { createActionGroup, props, emptyProps } from '@ngrx/store';

// Action group
export const CounterActions = createActionGroup({
  source: 'Counter',
  events: {
    'Increment': props<{ amount: number }>(),
    'Decrement': props<{ amount: number }>(),
    'Reset': emptyProps(),
  }
});

// State interface
interface CounterState {
  count: number;
  isLoading: boolean;
}

// Initial state
const initialState: CounterState = {
  count: 0,
  isLoading: false
};

// Feature creation with reducer
export const counterFeature = createFeature({
  name: 'counter',  
  reducer: createReducer(
    initialState,
    on(CounterActions.increment, (state, { amount }) => ({ 
      ...state, 
      count: state.count + amount 
    })),
    on(CounterActions.decrement, (state, { amount }) => ({ 
      ...state, 
      count: state.count - amount 
    })),
    on(CounterActions.reset, (state) => ({ 
      ...state, 
      count: 0 
    }))
  )
});