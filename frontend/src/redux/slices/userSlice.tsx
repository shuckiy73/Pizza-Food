import { createSlice } from "@reduxjs/toolkit"


export interface Iuser {
    email:string
    img_url:string
    first_name: string
    second_name: string
}

export interface initialState {
    access: string
    refresh: string
    user: Iuser
}

const initialState: initialState = {
    access: '',
    refresh: '',
    user: {
        email: '',
        img_url: '',
        first_name: '',
        second_name: ''
    }
}

const userSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setUserWithTokens: (state, action) => {
            state.access = action.payload.access
            state.refresh = action.payload.refresh
            state.user = action.payload.user
        },
        setAccess: (state, action) => {
            state.access = action.payload
        },
        setRefresh: (state, action) => {
            state.refresh = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        logoutUser: () => initialState
    }
})


export default userSlice.reducer
export const { setUserWithTokens, setAccess, setRefresh, setUser, logoutUser } = userSlice.actions