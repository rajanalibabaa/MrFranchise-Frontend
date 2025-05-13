import {createSlice} from "@reduxjs/toolkit";
const initialState = {
    user_id : null,
    token:null
};

const authSlice=createSlice({
    name : "auth",
    initialState,
    reducers : {
       setUserId : (state,action)=>{
    state.user_id = action.payload;
},
        setUserData : (state,action)=>{
    state.user_data = action.payload;
},
        logout:(state)=>{
    state.user_id = null;
    state.user_data = null;
}
    }
})
export const {setUserId,setUserData,logout} = authSlice.actions;
export default authSlice.reducer;