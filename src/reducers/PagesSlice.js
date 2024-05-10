import { createSlice } from '@reduxjs/toolkit';
import { addObjectKeyByUid } from './../utils/nodeHelper';

const pagesSlice = createSlice({
   name: 'pages',
   initialState: {
   },
   reducers: {
      addPages: (state, action) => {
         return { ...state, ...action.payload };
      },
      addPage: (state, action) => {
         const { page } = action.payload;
         return { ...state, [page.uid]: page };
      },
   }
});

export default pagesSlice.reducer;
export const { addPages, addPage } = pagesSlice.actions
