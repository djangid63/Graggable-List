import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value : 0,
}

const counterdata = createSlice({
    name : 'counter',
    initialState,

    reducers:{
        inc : (state) => {
            state.value += 1
        },

        dec : (state) => {
            if(state.value > 0){
                state.value -= 1
            }
        },

        reset : (state) => {
            state.value = 0
        },

        incdec : (state, action) => {
            state.value += action.payload
        }
    }
})

export const {inc, dec, reset, incdec} = counterdata.actions
export default counterdata.reducer
