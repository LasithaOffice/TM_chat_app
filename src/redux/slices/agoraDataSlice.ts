import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Avatars } from '../../entity/types'


export interface AgoraData {
  token: string,
  channelName: string,
  appId: string,
}

interface AgoraSliceState {
  data: AgoraData
}

const initialState: AgoraSliceState = {
  data: {
    token: "",
    channelName: "",
    appId: "",
  }
}

export const agoraSlice = createSlice({
  name: 'agoraSlice',
  initialState,
  reducers: {
    saveToken: (state, action: PayloadAction<AgoraData>) => {
      state.data = action.payload
    }
  }
})

export const { saveToken } = agoraSlice.actions

export const getAgoraToken = (state: RootState) => state.agora

export default agoraSlice.reducer