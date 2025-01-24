import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Avatars } from '../../entity/types'


// Define a type for the slice state
export interface User {
  email: string,
  displayName: string,
  avatar: Avatars
}

interface UserState {
  user: User
}

// Define the initial state using that type
const initialState: UserState = {
  user: {
    email: "",
    displayName: "",
    avatar: 'male_1'
  }
}

export const userSlice = createSlice({
  name: 'userSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    saveUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    }
  }
})

export const { saveUser } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getUser = (state: RootState) => state.user

export default userSlice.reducer