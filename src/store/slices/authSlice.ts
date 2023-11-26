import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loggedInAs: undefined,
  isPostPrivate: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.loggedInAs = action.payload
    },
    logOut: (state) => {
      state.loggedInAs = undefined
      state.isPostPrivate = false;
    }, 
    setPostPrivateStatus: (state, action) => { 
      // action.payload är true eller false beroende på om användaren vill göra sin post privat eller inte
      state.isPostPrivate = action.payload;
    },
    // När användaren raderar sitt konto så ska loggedInAs sättas till undefined så denna automatiskt loggas ut
    deleteUser: (state) => {
      state.loggedInAs = undefined;
      state.isPostPrivate = false;
    },
  },
})

export const { logIn, logOut, setPostPrivateStatus, deleteUser } = authSlice.actions

export default authSlice.reducer