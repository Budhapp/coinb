import { createSlice } from '@reduxjs/toolkit';
import { deepEqual } from './../utils';

const globalsSlice = createSlice({
   name: 'globals',
   initialState: {
      gptModal: false,
   },
   reducers: {
      setGlobalVar: (state, action) => {
         console.log(action.payload)
         const { key, value } = action.payload;
         if (!deepEqual(state[key], value)) {
            return {
               ...state,
               [key]: value,
            }
         }
         return state;
      },
   }
});

export default globalsSlice.reducer;
export const { setGlobalVar } = globalsSlice.actions
