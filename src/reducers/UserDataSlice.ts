import { createSlice } from '@reduxjs/toolkit';

export type TUserDataModel = Record<string, TDataModel>;

const userDataSlice = createSlice({
   name: 'userData',
   initialState: {
   },
   reducers: {
      setUserDataModel: (_, action) => {
         return action.payload;
      },
      // ...
   }
});

export default userDataSlice.reducer;
export const { setUserDataModel } = userDataSlice.actions
